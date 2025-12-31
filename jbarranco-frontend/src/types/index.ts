// Tipos de dominio para la aplicación J-Barranco

import { Timestamp } from "firebase/firestore";
import { EstadoTrabajo, Role } from "../constants";

export type { Role } from "../constants"; // Re-export Role

// ==========================================
// USUARIO
// ==========================================

export interface Usuario {
    uid: string;
    id?: string; // Alias for uid compatibility
    email: string;
    nombre: string;
    rol: Role;
    telefono?: string;
    urlImagenPerfil?: string;
    fechaCreacion: Timestamp;
    activo: boolean;
    terminosAceptados?: boolean;
    fechaAceptacionTerminos?: Timestamp | Date;
}

// ==========================================
// CLIENTE
// ==========================================

export interface Cliente {
    id: string;
    nombre: string;
    nombreComercial?: string; // Add optional trade name
    cuotaMensual?: number; // Cuota fija mensual estimada
    email?: string;
    telefono: string;
    direccion: string;
    comunidad?: string;
    cif?: string;
    codigoPostal: string;
    ciudad: string;
    nombreContacto: string;
    descripcion?: string;
    notasInternas?: string;
    activo?: boolean;
    fechaCreacion?: Timestamp;
    // Billing Fields
    iban?: string; // Cuenta bancaria para domiciliación
    fechaCargo?: number; // Día del mes para cargo (1-31)
    // Contract Fields
    diasContrato?: number[]; // 1=Lunes, 7=Domingo
    empleadoAsignadoId?: string;
    empleadoAsignadoNombre?: string;
    idUsuario?: string;
}

// ==========================================
// EMPLEADO
// ==========================================

export interface Empleado {
    id: string;
    uid: string;
    nombre: string;
    apellidos?: string; // Added based on usage
    email: string;
    telefono?: string;
    fechaContratacion: Timestamp;
    especialidad?: string;
    dni?: string; // Added based on usage
    costeHora?: number; // Coste por hora para la empresa
    horasMensuales?: number; // Horas contratadas al mes
    activo: boolean;
}

// ==========================================
// TRABAJO
// ==========================================

export interface Trabajo {
    id: string;
    clienteId: string;
    clienteNombre: string;
    empleadoId?: string;
    empleadoNombre?: string;
    direccion: string;
    fecha: Timestamp;
    fechaFin?: Timestamp; // Added based on usage
    fechaFinalizacion?: Timestamp; // Alias
    horaInicio: string;
    estado: EstadoTrabajo;
    tipo: "comunidad" | "oficina" | "cristales" | "otro";
    descripcion?: string;
    observaciones?: string;
    precio?: number;

    fechaCreacion: Timestamp;
    createdAt?: Timestamp; // Alias
}

// ==========================================
// COMUNICACIÓN (QUEJA)
// ==========================================

export interface Comunicacion {
    id: string;
    tipo: string;
    asunto: string;
    mensaje: string;
    fecha: Timestamp;
    leida: boolean;
    usuarioId?: string;
    usuarioNombre?: string;
}

// ==========================================
// TICKET (Sistema de incidencias)
// ==========================================

export type TicketType =
    | "averia"
    | "limpieza"
    | "sugerencia"
    | "administrativo"
    | "incidencia"
    | "extra"
    | "observacion"
    | "material"
    | "otro";
export type TicketStatus =
    | "abierto"
    | "en_progreso"
    | "resuelto"
    | "cerrado"
    | "pendiente"
    | "rechazado"
    | "solicitado"
    | "presupuestado"
    | "presupuesto_aceptado"
    | "aprobado"; // Added stats from other types
export type TicketPriority = "baja" | "media" | "alta" | "urgente";

export interface Ticket {
    id: string;
    clienteId: string;
    clienteNombre: string;
    tipo: TicketType;
    asunto: string;
    mensaje: string;
    estado: TicketStatus;
    prioridad: TicketPriority;
    fechaCreacion: Timestamp;
    fechaActualizacion: Timestamp;
    mensajes?: {
        autorId: string;
        autorNombre: string;
        mensaje: string;
        fecha: Timestamp;
        esAdmin: boolean;
    }[];
    origen?:
        | "comunicaciones"
        | "extras"
        | "trabajos"
        | "reposicion"
        | "tickets";
    metadata?: Record<string, unknown>;
}

// ==========================================
// TAREA
// ==========================================

export interface Tarea {
    id: string;
    trabajoId: string;
    empleadoId: string;
    descripcion: string;
    completada: boolean;
    fecha: Timestamp;
    observaciones?: string;
}

// ==========================================
// INVENTARIO
// ==========================================

// ==========================================
// INVENTARIO
// ==========================================

export interface ItemInventario {
    id: string;
    producto: string; // Changed from 'nombre' to match usage
    categoria: string;
    cantidad: number;
    precio?: number; // Coste unitario
    stockMinimo?: number;
    ubicacion?: string;
    ultimaActualizacion?: Timestamp | Date; // Allow Date for UI state
    createdAt?: Timestamp | Date;
}

export interface StockCliente {
    id: string;
    clienteId: string;
    clienteNombre: string;
    producto: string;
    categoria: string;
    cantidad: number;
    precio?: number; // Coste unitario
    stockMinimo?: number;
    ubicacion?: string;
    ultimaActualizacion: Timestamp | Date;
    createdAt?: Timestamp | Date;
}

export type RequestStatus = "pendiente" | "aprobada" | "rechazada";

export interface MaterialRequest {
    id: string;
    empleadoId: string;
    empleadoNombre: string;
    producto: string; // Nombre del producto o ID si está normalizado
    cantidad: number;
    estado: RequestStatus;
    fechaSolicitud: Timestamp | Date;
    fechaResolucion?: Timestamp | Date;
    motivoRechazo?: string;
    clienteId?: string; // Opcional, si es para un cliente específico
    clienteNombre?: string;
    observaciones?: string;
}

// ==========================================
// EXTRA (Trabajo Extra)
// ==========================================

export interface Extra {
    id: string;
    clienteId: string;
    clienteNombre: string;
    tipo: string;
    descripcion: string;
    budgetUrl?: string; // URL del presupuesto (PDF) en Storage
    budgetPath?: string; // Nuevo: Path para Signed URLs
    estado:
        | "solicitado"
        | "presupuestado" // Admin ha enviado presupuesto
        | "presupuesto_aceptado" // Cliente ha aceptado presupuesto
        | "aprobado" // Admin ha convertido en trabajo
        | "en_progreso"
        | "completado"
        | "rechazado"
        | "pendiente";
    presupuesto?: number;
    fecha: Timestamp;
    fechaRealizacion?: Timestamp;
    fechaCreacion?: Timestamp;
    createdAt?: Timestamp;
    fechaSolicitud?: Timestamp;
    fechaPreferente?: Timestamp;
    empleadoId?: string;
    empleadoNombre?: string;
    direccion?: string;
    comentariosCliente?: string;
}

export * from "./rating";

// ==========================================
// NOTIFICACIÓN
// ==========================================

export interface Notificacion {
    id: string;
    tipo: "trabajo" | "queja" | "extra" | "sistema";
    mensaje: string;
    message?: string; // Alias
    link: string;
    timestamp: Timestamp;
    leida: boolean;
    usuarioId: string;
}

export interface AuthContextType {
    user: Usuario | null;
    userRole: Role | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser?: () => Promise<void>; // Added
}

// ==========================================
// CALENDARIO
// ==========================================

export interface CalendarEvent<
    T = Trabajo | Extra | Ticket | Record<string, unknown>,
> {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    resource?: T;
}

// ==========================================
// RUTAS Y TAREAS ESPECIALES
// ==========================================

export type RoutesMap = Record<string, string[] | Date | Timestamp | undefined>;

export interface TareaEspecial {
    id: string;
    descripcion: string;
    idComunidad: string;
    estado: string;
    fechaAsignacion?: Timestamp | Date;
    empleadoId?: string;
    [key: string]: unknown;
}

// ==========================================
// CMS
// ==========================================

export interface CompanyData {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    cif: string;
    descripcion: string;
    updatedAt?: Date;
}

export interface WebContent {
    homeTitle: string;
    homeDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    updatedAt?: Date;
}

export interface ServiceItem {
    id: number;
    titulo: string;
    descripcion: string;
}
