import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Ticket, TicketStatus } from "../types";
import { notifyNewTicket } from "../utils/notifications";

const COLLECTION_NAME = "tickets"; // Mantenemos esta para tickets manuales si existen

export const createTicket = async (
    ticketData: Omit<
        Ticket,
        "id" | "fechaCreacion" | "fechaActualizacion" | "estado" | "mensajes"
    >,
) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...ticketData,
            estado: "abierto",
            fechaCreacion: Timestamp.now(),
            fechaActualizacion: Timestamp.now(),
            mensajes: [],
        });

        // Enviar notificación por email (Fire & Forget)
        notifyNewTicket({
            type: (ticketData.tipo as
                | "incidencia"
                | "observacion"
                | "extra"
                | "material") || "incidencia",
            clientName: ticketData.clienteNombre || "Cliente",
            description: `${ticketData.asunto}\n\n${ticketData.mensaje}`,
            authorName: ticketData.clienteNombre || "Usuario",
        });

        return docRef.id;
    } catch (error) {
        console.error("Error creating ticket:", error);
        throw error;
    }
};

export const getTicketsByClient = async (
    clienteId: string,
): Promise<Ticket[]> => {
    try {
        // En un escenario real, habría que buscar en todas las colecciones también
        // Por simplicidad ahora, buscamos en la colección principal
        const q = query(
            collection(db, COLLECTION_NAME),
            where("clienteId", "==", clienteId),
            orderBy("fechaCreacion", "desc"),
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        } as Ticket));
    } catch (error) {
        console.error("Error fetching client tickets:", error);
        throw error;
    }
};

export const getAllTickets = async (): Promise<Ticket[]> => {
    try {
        // 1. Comunicaciones (Quejas/Sugerencias)
        const qCom = query(
            collection(db, "comunicaciones"),
            orderBy("fechaCreacion", "desc"),
            limit(50),
        );

        // 2. Trabajos Extra
        // 2. Trabajos Extra
        const qExtra = query(
            collection(db, "extras"),
            // orderBy("fechaCreacion", "desc"), // Disabled to avoid index issues
            limit(50),
        );

        // 3. Observaciones en Trabajos
        // Fix: Use simple query without orderBy to avoid composite index requirement
        // (Dashboard uses this query and it works)
        const qObs = query(
            collection(db, "trabajos"),
            where("observaciones", "!=", ""),
            limit(50),
        );

        // 4. Reposiciones
        const qRepo = query(
            collection(db, "reposicion"),
            // orderBy("fecha", "desc"), // Disabled to allow mixed data
            limit(50),
        );

        // 5. Tickets Manuales (Legacy o Generados Manualmente)
        // Eliminamos orderBy temporalmente para verificar si es problema de índices
        const qTickets = query(
            collection(db, COLLECTION_NAME),
            // orderBy("fechaCreacion", "desc"),
            limit(50),
        );

        const [snapCom, snapExtra, snapObs, snapRepo, snapTickets] =
            await Promise.all([
                getDocs(qCom),
                getDocs(qExtra),
                getDocs(qObs),
                getDocs(qRepo),
                getDocs(qTickets),
            ]);

        const tickets: Ticket[] = [];

        // Mapping Comunicaciones
        snapCom.forEach((doc) => {
            const data = doc.data();
            tickets.push({
                id: doc.id,
                clienteId: data.clienteId || "unknown",
                clienteNombre: data.clienteNombre || "Cliente Desconocido",
                asunto: `[${data.tipo?.toUpperCase() || "SOPORTE"}] ${
                    data.asunto || "Sin asunto"
                }`,
                mensaje: data.mensaje || "",
                tipo: "incidencia", // Mapping general
                metadata: {
                    limpiezaCompletada: data.estado === "completado"
                        ? "SI"
                        : "NO",
                    empleadoNombre: data.empleadoNombre || "Sin Asignar",
                },
                prioridad: "media",
                estado: data.estado === "recibido"
                    ? "abierto"
                    : data.estado || "abierto",
                fechaCreacion: data.fecha || data.fechaCreacion ||
                    Timestamp.now(),
                fechaActualizacion: data.fecha || Timestamp.now(),
                mensajes: [],
                origen: "comunicaciones",
            } as Ticket);
        });

        // Mapping Extras
        snapExtra.forEach((doc) => {
            const data = doc.data();
            tickets.push({
                id: doc.id,
                clienteId: data.clienteId || "unknown",
                clienteNombre: data.clienteNombre || "Cliente Desconocido",
                asunto: `${data.descripcion?.substring(0, 30)}...`,
                mensaje: `Solicitud de trabajo extra: ${data.descripcion}`,
                tipo: "extra",
                prioridad: "media",
                estado: (() => {
                    const status = data.estado;
                    if (status === "pendiente" || status === "solicitado") {
                        return "pendiente";
                    }
                    if (status === "presupuestado") return "presupuestado";
                    if (status === "presupuesto_aceptado") {
                        return "presupuesto_aceptado";
                    }
                    if (status === "completado") return "resuelto";
                    if (status === "rechazado") return "rechazado";
                    if (status === "en_progreso") return "en_progreso";
                    return "abierto";
                })(),
                fechaCreacion: data.fechaCreacion || data.createdAt ||
                    Timestamp.now(),
                fechaActualizacion: data.fechaActualizacion ||
                    data.fechaCreacion || Timestamp.now(),
                mensajes: [],
                origen: "extras",
                metadata: {
                    budgetUrl: data.budgetUrl,
                    budgetPath: data.budgetPath,
                },
            } as Ticket);
        });

        // Mapping Observaciones
        snapObs.forEach((doc) => {
            const data = doc.data();
            // Filter in memory: Only include if observaciones is present and not empty
            if (!data.observaciones || data.observaciones.trim() === "") return;

            tickets.push({
                id: doc.id,
                clienteId: data.clienteId || "unknown",
                clienteNombre: data.clienteNombre || data.comunidad ||
                    "Ubicación Desconocida",
                asunto: data.observaciones, // User requested detail in subject
                mensaje: `Observación del empleado: ${data.observaciones}`,
                tipo: "observacion",
                prioridad: data.estado === "no_completada" ? "alta" : "baja",
                estado: "abierto",
                fechaCreacion: data.completedAt || data.fechaFinalizacion ||
                    Timestamp.now(),
                fechaActualizacion: data.completedAt || Timestamp.now(),
                mensajes: [],
                origen: "trabajos",
                metadata: {
                    limpiezaCompletada: data.estado === "completado"
                        ? "SI"
                        : "NO",
                    empleadoNombre: data.empleadoNombre || "Sin Asignar",
                },
            } as Ticket);
        });

        // Mapping Reposiciones
        snapRepo.forEach((doc) => {
            const data = doc.data();
            tickets.push({
                id: doc.id,
                clienteId: data.empleadoId || "unknown",
                clienteNombre: data.empleadoNombre || "Empleado",
                asunto: `[MATERIAL] Solicitud: ${data.producto}`,
                mensaje: `Cantidad: ${data.cantidad}. Comentarios: ${
                    data.comentarios || ""
                }`,
                tipo: "material",
                prioridad: "baja",
                estado: data.estado === "pendiente" ? "abierto" : "cerrado",
                fechaCreacion: data.fecha,
                fechaActualizacion: data.fecha,
                mensajes: [],
                origen: "reposicion",
            } as Ticket);
        });

        // Mapping Tickets Manuales
        snapTickets.forEach((doc) => {
            const data = doc.data();
            tickets.push({
                id: doc.id,
                clienteId: data.clienteId || "unknown",
                clienteNombre: data.clienteNombre || "Desconocido",
                tipo: data.tipo || "otro",
                asunto: data.asunto || "Sin asunto",
                mensaje: data.mensaje || "",
                estado: data.estado || "abierto",
                prioridad: data.prioridad || "media",
                fechaCreacion: data.fechaCreacion,
                fechaActualizacion: data.fechaActualizacion,
                mensajes: data.mensajes || [],
                origen: "tickets",
            } as Ticket);
        });

        // Ordenar unificados por fecha descendente
        return tickets.sort((a, b) => {
            const timeA = a.fechaCreacion?.toDate
                ? a.fechaCreacion.toDate().getTime()
                : 0;
            const timeB = b.fechaCreacion?.toDate
                ? b.fechaCreacion.toDate().getTime()
                : 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error("Error fetching all tickets:", error);
        throw error;
    }
};

export const updateTicketStatus = async (
    ticketId: string,
    status: TicketStatus,
    origin: string = COLLECTION_NAME,
) => {
    try {
        const collectionName = origin === "tickets" ? COLLECTION_NAME : origin;
        const ticketRef = doc(db, collectionName, ticketId);

        const updateData: Record<string, unknown> = {
            fechaActualizacion: Timestamp.now(),
        };

        // Handle specific status mapping
        if (origin === "comunicaciones") {
            // Map TicketStatus to Comunicacion status if needed
            // For now, we can use the same status or a specific field
            updateData.estado = status === "resuelto" ? "completado" : status;
        } else if (origin === "trabajos") {
            // For jobs, we don't want to mess with the main 'estado' (completado/no_completado)
            // So we use a specific auxiliary field for the ticket view
            updateData.ticketStatus = status;
        } else if (origin === "extras") {
            updateData.estado = status;
        } else if (origin === "reposicion") {
            // Reposicion uses 'pendiente' | 'aprobada' | 'rechazada'
            // Mapping is tricky. Let's use auxiliary field if status doesn't match
            if (status === "resuelto") updateData.estado = "aprobada"; // Example
            else if (status === "cerrado") updateData.estado = "rechazada"; // Example
            else updateData.ticketStatus = status;
        } else {
            // Default (tickets collection)
            updateData.estado = status;
        }

        await updateDoc(ticketRef, updateData);
    } catch (error) {
        console.error("Error updating ticket status:", error);
        throw error;
    }
};

export const addTicketResponse = async (
    ticketId: string,
    response: {
        autorId: string;
        autorNombre: string;
        mensaje: string;
        esAdmin: boolean;
    },
    origin: string = COLLECTION_NAME,
) => {
    try {
        const collectionName = origin === "tickets" ? COLLECTION_NAME : origin;
        const ticketRef = doc(db, collectionName, ticketId);

        await updateDoc(ticketRef, {
            mensajes: arrayUnion({
                ...response,
                fecha: Timestamp.now(),
            }),
            fechaActualizacion: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error adding ticket response:", error);
        throw error;
    }
};
