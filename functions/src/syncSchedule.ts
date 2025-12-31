import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Sincronización Automática de Agenda según Contrato
 * Trigger: Cuando se actualiza un cliente (diasContrato o empleadoAsignado)
 */
export const syncClientSchedule = functions.firestore
    .document("clientes/{clientId}")
    .onWrite(async (change, context) => {
        const before = change.before.exists ? change.before.data() : null;
        const after = change.after.exists ? change.after.data() : null;

        if (!after) {
            console.log("Cliente eliminado, no se sincroniza agenda.");
            return null; // Opcional: Cancelar trabajos futuros
        }

        // Verificar si cambios relevantes
        const daysChanged = JSON.stringify(before?.diasContrato) !==
            JSON.stringify(after.diasContrato);
        const employeeChanged =
            before?.empleadoAsignadoId !== after.empleadoAsignadoId;

        if (!daysChanged && !employeeChanged) {
            return null;
        }

        const clientId = context.params.clientId;
        const diasContrato = (after.diasContrato || []) as number[]; // [1, 3, 5]
        const empleadoId = after.empleadoAsignadoId;
        const empleadoNombre = after.empleadoAsignadoNombre || "Sin asignar";
        const clienteNombre = after.nombre;

        console.log(
            `🔄 Sincronizando agenda para ${clienteNombre} (${clientId})...`,
        );

        // Ventana de tiempo: Mañana -> +30 días
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + 1); // Empezar mañana para no tocar hoy

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30); // 30 días de planificación

        // 1. Obtener trabajos PENDIENTES existentes en la ventana
        const jobsSnapshot = await admin.firestore()
            .collection("trabajos")
            .where("clienteId", "==", clientId)
            .where("fecha", ">=", admin.firestore.Timestamp.fromDate(startDate))
            .where("fecha", "<=", admin.firestore.Timestamp.fromDate(endDate))
            .where("estado", "==", "pendiente") // Solo tocar pendientes
            .get();

        const existingJobsMap = new Map(); // Key: "YYYY-MM-DD"
        jobsSnapshot.docs.forEach((doc) => {
            const date = doc.data().fecha.toDate();
            const dateKey = date.toISOString().split("T")[0];
            existingJobsMap.set(dateKey, doc.id);
        });

        const batch = admin.firestore().batch();
        let operationsCount = 0;

        // 2. Iterar cada día de la ventana
        const loopDate = new Date(startDate);
        while (loopDate <= endDate) {
            // Javascript getDay(): 0=Domingo, 1=Lunes...
            // Ajustar si es necesario, pero nuestro UI usa 0-6 estándar.
            const dayOfWeek = loopDate.getDay();
            const dateKey = loopDate.toISOString().split("T")[0];
            const jobId = existingJobsMap.get(dateKey);

            const isContractDay = diasContrato.includes(dayOfWeek);

            if (isContractDay) {
                if (jobId) {
                    // EXISTE: Actualizar empleado si cambió
                    if (employeeChanged) {
                        const jobRef = admin.firestore().collection("trabajos")
                            .doc(jobId);
                        batch.update(jobRef, {
                            empleadoId: empleadoId || null,
                            empleadoNombre: empleadoId ? empleadoNombre : null,
                        });
                        operationsCount++;
                    }
                } else {
                    // NO EXISTE: Crear Trabajo
                    const newJobRef = admin.firestore().collection("trabajos")
                        .doc();
                    const newJob = {
                        clienteId: clientId,
                        clienteNombre,
                        empleadoId: empleadoId || null,
                        empleadoNombre: empleadoId ? empleadoNombre : null,
                        direccion: after.direccion || "",
                        titulo: `Limpieza - ${clienteNombre}`, // Usar título genérico o tipo
                        tipo: "comunidad", // Default
                        estado: "pendiente",
                        fecha: admin.firestore.Timestamp.fromDate(
                            new Date(loopDate),
                        ),
                        horaInicio: "09:00", // Default
                        fechaCreacion: admin.firestore.FieldValue
                            .serverTimestamp(),
                        generatedBy: "syncClientSchedule", // Flag para debug
                    };
                    batch.set(newJobRef, newJob);
                    operationsCount++;
                }
            } else {
                if (jobId) {
                    // NO ES DÍA DE CONTRATO PERO EXISTE (Y es pendiente): Borrar
                    // Esto maneja cuando quitamos un día del contrato
                    const jobRef = admin.firestore().collection("trabajos").doc(
                        jobId,
                    );
                    batch.delete(jobRef);
                    operationsCount++;
                }
            }

            // Next day
            loopDate.setDate(loopDate.getDate() + 1);
        }

        if (operationsCount > 0) {
            await batch.commit();
            console.log(
                `✅ Agenda sincronizada. Operaciones: ${operationsCount}`,
            );
        } else {
            console.log("Agenda actualizada, sin cambios necesarios.");
        }

        return null;
    });
