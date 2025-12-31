import {
    collection,
    doc,
    getDocs,
    query,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const generateClientSchedule = async (
    clienteId: string,
    clienteNombre: string,
    direccion: string,
    diasContrato: number[],
    empleadoId?: string,
    empleadoNombre?: string,
) => {
    if (!diasContrato || diasContrato.length === 0) return 0;

    // 1. Eliminar trabajos pendientes FUTUROS de este cliente para evitar duplicados
    // (Solo eliminamos los pendientes para no afectar historial ni completados)
    const jobsRef = collection(db, "trabajos");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
        jobsRef,
        where("clienteId", "==", clienteId),
        where("fecha", ">=", Timestamp.fromDate(today)),
        where("estado", "==", "pendiente"),
    );

    try {
        const snapshot = await getDocs(q);
        const batchDelete = writeBatch(db);
        let deleteCount = 0;

        // Firestore batch limit is 500. If more, we might need chunks,
        // but for a single client usually ok. Safe to split if needed.
        // For V1 we assume < 500 pending jobs.
        snapshot.forEach((doc) => {
            batchDelete.delete(doc.ref);
            deleteCount++;
        });

        if (deleteCount > 0) await batchDelete.commit();
    } catch (error) {
        console.error("Error cleaning old schedule:", error);
        // Continue generation even if delete fails (worst case duplicates)
    }

    // 2. Generar trabajos para los próximos 12 meses
    const batch = writeBatch(db);
    let opsCount = 0;

    const endDate = new Date(today);
    endDate.setFullYear(today.getFullYear() + 1); // 1 Año desde hoy

    const current = new Date(today);

    // Mapeo simple para descripciones
    const daysMap = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    while (current <= endDate) {
        if (diasContrato.includes(current.getDay())) {
            const newJobRef = doc(collection(db, "trabajos"));
            const fechaTimestamp = Timestamp.fromDate(new Date(current));

            const dayName = daysMap[current.getDay()];

            batch.set(newJobRef, {
                id: newJobRef.id,
                clienteId,
                clienteNombre,
                direccion,
                empleadoId: empleadoId || "",
                empleadoNombre: empleadoNombre || "",
                fecha: fechaTimestamp, // Fecha del trabajo
                horaInicio: "09:00", // Hora por defecto
                estado: "pendiente",
                tipo: "comunidad", // Tipo por defecto, podría ser configurable
                descripcion: `Limpieza Básica (${dayName})`,
                // observaciones: "Generado automáticamente por contrato",
                fechaCreacion: Timestamp.now(),
                createdAt: Timestamp.now(), // Alias para compatibilidad
            });
            opsCount++;

            // Safety check for batch limit (500)
            if (opsCount >= 450) {
                break; // Stop for V1 safety
            }
        }
        current.setDate(current.getDate() + 1);
    }

    if (opsCount > 0) {
        await batch.commit();
    }

    return opsCount;
};
