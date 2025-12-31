import { Cliente, Empleado } from "../../../types";

export interface ClientFormInputs {
    nombre: string;
    cif: string;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    nombreContacto: string;
    telefono: string;
    email: string;
    password?: string;
    idUsuario?: string;
    cuotaMensual?: number;
    iban?: string;
    fechaCargo?: number;
    diasContrato?: string[]; // RHF uses string array for checkboxes
    empleadoAsignadoId?: string;
}

/**
 * Maps Firestore Client data to React Hook Form inputs
 */
export const mapClientToForm = (data: Cliente): ClientFormInputs => {
    return {
        nombre: data.nombre || "",
        cif: data.cif || "",
        direccion: data.direccion || "",
        codigoPostal: data.codigoPostal || "",
        ciudad: data.ciudad || "",
        nombreContacto: data.nombreContacto || "",
        telefono: data.telefono || "",
        email: data.email || "",
        password: "", // Never load password
        idUsuario: data.idUsuario || "",
        cuotaMensual: data.cuotaMensual || 0,
        iban: data.iban || "",
        fechaCargo: data.fechaCargo || undefined,
        // Convert to string array for Checkbox group compatibility
        diasContrato: (data.diasContrato || []).map(String),
        empleadoAsignadoId: data.empleadoAsignadoId || "",
    };
};

/**
 * Prepares Firestore object from Form Data (excluding UI-only fields like password)
 */
export const mapFormToClientData = (
    data: ClientFormInputs,
    employees: Empleado[],
) => {
    // Determine Assigned Employee Name
    let empleadoAsignadoNombre = "";
    if (data.empleadoAsignadoId) {
        const emp = employees.find((e) => e.id === data.empleadoAsignadoId);
        if (emp) {
            empleadoAsignadoNombre = `${emp.nombre} ${emp.apellidos || ""}`
                .trim();
        }
    }

    // Days back to numbers
    const diasContratoNumbers = Array.isArray(data.diasContrato)
        ? data.diasContrato.map(Number)
        : [];

    return {
        nombre: data.nombre,
        cif: data.cif,
        direccion: data.direccion,
        codigoPostal: data.codigoPostal,
        ciudad: data.ciudad,
        nombreContacto: data.nombreContacto,
        telefono: data.telefono,
        email: data.email,
        idUsuario: data.idUsuario,
        cuotaMensual: Number(data.cuotaMensual) || 0,
        iban: data.iban || "",
        fechaCargo: data.fechaCargo ? Number(data.fechaCargo) : undefined,
        diasContrato: diasContratoNumbers,
        empleadoAsignadoId: data.empleadoAsignadoId,
        empleadoAsignadoNombre,
    };
};
