import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { createAuthUser } from "../../../utils/authAdmin";
import { EmployeeFormInputs } from "../../../schemas/employeeSchema";

export const checkDuplicates = async (
    dni: string,
    telefono: string,
    excludeId?: string,
) => {
    const dniQuery = query(
        collection(db, "empleados"),
        where("dni", "==", dni),
    );
    const phoneQuery = query(
        collection(db, "empleados"),
        where("telefono", "==", telefono),
    );

    const [dniSnap, phoneSnap] = await Promise.all([
        getDocs(dniQuery),
        getDocs(phoneQuery),
    ]);

    const duplicateDni = excludeId
        ? dniSnap.docs.find((doc) => doc.id !== excludeId)
        : !dniSnap.empty;

    const duplicatePhone = excludeId
        ? phoneSnap.docs.find((doc) => doc.id !== excludeId)
        : !phoneSnap.empty;

    return { duplicateDni, duplicatePhone };
};

export const createEmployee = async (data: EmployeeFormInputs) => {
    // Crear nuevo empleado
    let newId = data.idUsuario?.trim() || null;
    let authCreated = false;

    // Si no se proporcionó ID manual y tenemos contraseña, intentamos crear en Auth
    if (!newId && data.password) {
        newId = await createAuthUser(data.email, data.password);
        authCreated = true;
    }

    // Preparar datos para Firestore
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...firestoreData } = data;

    const employeeData = {
        ...firestoreData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    let newEmployeeRef;

    if (newId) {
        await setDoc(doc(db, "empleados", newId), employeeData);
        newEmployeeRef = { id: newId };
    } else {
        newEmployeeRef = await addDoc(
            collection(db, "empleados"),
            employeeData,
        );
    }

    // 2. Crear documento espejo en 'usuarios'
    await setDoc(doc(db, "usuarios", newEmployeeRef.id), {
        idUsuario: newEmployeeRef.id,
        nombre: data.nombre + " " + data.apellidos,
        email: data.email,
        rol: "empleado",
        activo: true,
        fechaCreacion: new Date(),
        urlImagenPerfil: "",
    });

    return { authCreated };
};

export const updateEmployee = async (id: string, data: EmployeeFormInputs) => {
    const docRef = doc(db, "empleados", id);
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...firestoreData } = data;

    await updateDoc(docRef, {
        ...firestoreData,
        updatedAt: new Date(),
    });
};
