import { db } from "./config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

// COLECCIONES
const clientesCollection = collection(db, "clientes");
const empleadosCollection = collection(db, "empleados");

// TIPOS
import { Cliente, Empleado } from "../types";

// --- SERVICIOS PARA CLIENTES ---
export const getClients = async (): Promise<Cliente[]> => {
    const snapshot = await getDocs(clientesCollection);
    return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Cliente),
    );
};

// addClient and updateClient removed (unused)

export const deleteClient = async (id: string): Promise<void> => {
    const clientRef = doc(db, "clientes", id);
    await deleteDoc(clientRef);
};

// --- SERVICIOS PARA EMPLEADOS ---
export const getEmployees = async (): Promise<Empleado[]> => {
    const snapshot = await getDocs(empleadosCollection);
    return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Empleado),
    );
};

// addEmployee and updateEmployee removed (unused)

export const deleteEmployee = async (id: string): Promise<void> => {
    const employeeRef = doc(db, "empleados", id);
    await deleteDoc(employeeRef);
};
