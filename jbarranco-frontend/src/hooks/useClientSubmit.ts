import { useNavigate } from "react-router-dom";
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
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import { createAuthUser } from "../utils/authAdmin";
import { generateClientSchedule } from "../services/scheduleGenerator";
import { Empleado } from "../types";
import {
    ClientFormInputs,
    mapFormToClientData,
} from "../components/admin/clients/clientHelpers";

export const useClientSubmit = (
    employees: Empleado[],
) => {
    const navigate = useNavigate();

    const handleCreateClient = async (data: ClientFormInputs) => {
        // 1. Duplicates Check
        const cifQuery = query(
            collection(db, "clientes"),
            where("cif", "==", data.cif),
        );
        const phoneQuery = query(
            collection(db, "clientes"),
            where("telefono", "==", data.telefono),
        );
        const [cifSnap, phoneSnap] = await Promise.all([
            getDocs(cifQuery),
            getDocs(phoneQuery),
        ]);

        if (!cifSnap.empty) throw new Error("El CIF ya existe.");
        if (!phoneSnap.empty) throw new Error("El teléfono ya existe.");

        // 2. Auth Creation
        let newId = data.idUsuario?.trim() || null;
        let authCreated = false;

        if (!newId && data.password) {
            toast.loading("Creando usuario Auth...");
            try {
                newId = await createAuthUser(data.email, data.password);
                authCreated = true;
                toast.dismiss();
            } catch (error) {
                console.error("Auth creation failed (ignored in UI):", error); // Log ignored error
                toast.dismiss();
                throw new Error("Error Auth: Fallo al crear usuario");
            }
        }

        // 3. Firestore Creation
        const mappedData = mapFormToClientData(data, employees);
        const clientData = { ...mappedData, createdAt: new Date() };

        let newClientRef;
        if (newId) {
            await setDoc(doc(db, "clientes", newId), clientData);
            newClientRef = { id: newId };
        } else {
            newClientRef = await addDoc(collection(db, "clientes"), clientData);
        }

        // 4. User Mirror
        await setDoc(doc(db, "usuarios", newClientRef.id), {
            idUsuario: newClientRef.id,
            nombre: data.nombre,
            email: data.email,
            rol: "cliente",
            activo: true,
            fechaCreacion: new Date(),
            urlImagenPerfil: "",
        });

        toast.success(
            authCreated ? "Cliente + Usuario Auth Creado" : "Cliente Creado",
        );

        // 5. Schedule
        if (data.diasContrato && data.diasContrato.length > 0) {
            toast.loading("Generando calendario anual...", { duration: 3000 });
            await generateClientSchedule(
                newId || newClientRef.id,
                data.nombre,
                data.direccion,
                data.diasContrato.map(Number),
                data.empleadoAsignadoId,
                mappedData.empleadoAsignadoNombre,
            );
            toast.success("Calendario generado para 1 año");
        }

        navigate("/admin/clients");
    };

    const handleUpdateClient = async (id: string, data: ClientFormInputs) => {
        // 1. Check duplicates
        const cifQuery = query(
            collection(db, "clientes"),
            where("cif", "==", data.cif),
        );
        const phoneQuery = query(
            collection(db, "clientes"),
            where("telefono", "==", data.telefono),
        );
        const [cifSnap, phoneSnap] = await Promise.all([
            getDocs(cifQuery),
            getDocs(phoneQuery),
        ]);

        if (cifSnap.docs.find((doc) => doc.id !== id)) {
            throw new Error(`El CIF ${data.cif} ya está en uso.`);
        }
        if (phoneSnap.docs.find((doc) => doc.id !== id)) {
            throw new Error(`El teléfono ${data.telefono} ya está en uso.`);
        }

        // 2. Update
        const docRef = doc(db, "clientes", id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...firestoreData } = data; // remove password from firestore update

        await updateDoc(docRef, { ...firestoreData, updatedAt: new Date() });

        // 3. Schedule
        if (data.diasContrato && data.diasContrato.length > 0) {
            toast.loading("Actualizando calendario...", { duration: 3000 });
            let empName = "";
            if (data.empleadoAsignadoId) {
                const emp = employees.find((e) =>
                    e.id === data.empleadoAsignadoId
                );
                if (emp) {
                    empName = `${emp.nombre} ${emp.apellidos || ""}`.trim();
                }
            }
            await generateClientSchedule(
                id,
                data.nombre,
                data.direccion,
                data.diasContrato.map(Number),
                data.empleadoAsignadoId,
                empName,
            );
            toast.success("Calendario actualizado");
        }

        toast.success("Cliente actualizado correctamente");
        navigate("/admin/clients");
    };

    const onSubmit = async (data: ClientFormInputs, id?: string) => {
        try {
            if (id && id !== "new") {
                await handleUpdateClient(id, data);
            } else {
                await handleCreateClient(data);
            }
        } catch (error) {
            console.error(error);
            const message = error instanceof Error
                ? error.message
                : "Error al guardar";
            toast.error(message);
        }
    };

    return { onSubmit };
};
