import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Cloud Function para enviar notificaciones push
 * Llamable desde el frontend
 */
export const sendPushNotification = functions.https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        // Verificar que el usuario está autenticado
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "Usuario debe estar autenticado",
            );
        }

        const { token, title, body, url, data: extraData } = data;

        // Validación exhaustiva de inputs
        if (!token || typeof token !== "string" || token.trim().length === 0) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "Token FCM inválido o vacío",
            );
        }

        if (!title || typeof title !== "string" || title.trim().length === 0) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "El título es requerido",
            );
        }

        if (title.length > 100) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "El título no puede exceder 100 caracteres",
            );
        }

        if (!body || typeof body !== "string" || body.trim().length === 0) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "El mensaje es requerido",
            );
        }

        if (body.length > 500) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "El mensaje no puede exceder 500 caracteres",
            );
        }

        // Validar URL si se proporciona
        if (url && typeof url !== "string") {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "La URL debe ser una cadena de texto",
            );
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            data: {
                url: url || "/",
                clickAction: "OPEN_URL",
                ...extraData,
            },
            token: token,
            webpush: {
                fcmOptions: {
                    link: url || "/",
                },
                notification: {
                    icon: "/icon-192x192.png",
                    badge: "/icon-192x192.png",
                },
            },
        };

        try {
            const response = await admin.messaging().send(message);
            console.log("✅ Notificación enviada:", {
                messageId: response,
                userId: context.auth.uid,
                title: title.substring(0, 50),
            });
            return { success: true, messageId: response };
        } catch (error: any) {
            console.error("❌ Error al enviar notificación:", {
                error: error.message,
                code: error.code,
                userId: context.auth.uid,
            });

            // Errores específicos de FCM
            if (error.code === "messaging/invalid-registration-token") {
                throw new functions.https.HttpsError(
                    "invalid-argument",
                    "Token FCM inválido o expirado",
                );
            }

            if (error.code === "messaging/registration-token-not-registered") {
                throw new functions.https.HttpsError(
                    "not-found",
                    "Token FCM no registrado",
                );
            }

            throw new functions.https.HttpsError(
                "internal",
                "Error al enviar notificación: " + error.message,
            );
        }
    },
);

/**
 * Trigger automático cuando se crea una nueva queja
 * Notifica a todos los administradores
 */
export const onComplaintCreated = functions.firestore
    .document("comunicaciones/{complaintId}")
    .onCreate(async (snap, context) => {
        const complaint = snap.data();

        // Validar que existen datos
        if (!complaint) {
            console.error("❌ Queja sin datos:", context.params.complaintId);
            return null;
        }

        // Solo procesar quejas
        if (complaint.tipo !== "queja") {
            console.log("⏭️ Comunicación no es queja, ignorando");
            return null;
        }

        console.log("🔔 Nueva queja creada:", {
            id: context.params.complaintId,
            cliente: complaint.clienteNombre || "Anónimo",
        });

        try {
            // Obtener todos los administradores con FCM token
            const adminsSnapshot = await admin
                .firestore()
                .collection("usuarios")
                .where("rol", "==", "admin")
                .get();

            // Filtrar solo los que tienen FCM token
            const adminsWithTokens = adminsSnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((admin: any) => admin.fcmToken);

            if (adminsWithTokens.length === 0) {
                console.log("No hay administradores con FCM token");
                return null;
            }

            // Preparar notificación con validación de datos
            const clienteNombre =
                (complaint.clienteNombre &&
                        typeof complaint.clienteNombre === "string")
                    ? complaint.clienteNombre.substring(0, 50)
                    : "Cliente";

            const descripcion =
                (complaint.descripcion &&
                        typeof complaint.descripcion === "string")
                    ? complaint.descripcion.substring(0, 100)
                    : "Sin descripción";

            const notification = {
                title: "🔴 Nueva Queja Recibida",
                body: `${clienteNombre}: ${descripcion}`,
            };

            const data = {
                url: "/admin/complaints",
                type: "new_complaint",
                complaintId: context.params.complaintId,
            };

            // Enviar a cada admin
            const promises = adminsWithTokens.map((adminUser: any) => {
                const message = {
                    notification,
                    data,
                    token: adminUser.fcmToken,
                    webpush: {
                        fcmOptions: {
                            link: "/admin/complaints",
                        },
                        notification: {
                            icon: "/icon-192x192.png",
                            badge: "/icon-192x192.png",
                        },
                    },
                };

                return admin
                    .messaging()
                    .send(message)
                    .catch((error) => {
                        console.error(
                            `Error enviando a admin ${adminUser.id}:`,
                            error,
                        );
                        // Si el token es inválido, eliminarlo
                        if (
                            error.code ===
                                "messaging/invalid-registration-token" ||
                            error.code ===
                                "messaging/registration-token-not-registered"
                        ) {
                            return admin
                                .firestore()
                                .collection("usuarios")
                                .doc(adminUser.id)
                                .update({
                                    fcmToken: admin.firestore.FieldValue
                                        .delete(),
                                });
                        }
                        return null;
                    });
            });

            const results = await Promise.allSettled(promises);
            const successful = results.filter((r) =>
                r.status === "fulfilled"
            ).length;
            const failed = results.filter((r) =>
                r.status === "rejected"
            ).length;

            console.log(
                `✅ Notificaciones enviadas: ${successful}/${adminsWithTokens.length}`,
                {
                    successful,
                    failed,
                    complaintId: context.params.complaintId,
                },
            );

            return null;
        } catch (error: any) {
            console.error("❌ Error en onComplaintCreated:", {
                error: error.message,
                complaintId: context.params.complaintId,
            });
            return null;
        }
    });

/**
 * Trigger automático cuando se completa un trabajo
 * Notifica al cliente
 */
export const onJobCompleted = functions.firestore
    .document("trabajos/{jobId}")
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();

        // Validar datos
        if (!before || !after) {
            console.error("❌ Datos de trabajo inválidos");
            return null;
        }

        // Solo si cambió a completado
        if (before.estado !== "completado" && after.estado === "completado") {
            console.log("✅ Trabajo completado:", {
                jobId: context.params.jobId,
                cliente: after.clienteId,
            });

            try {
                // Obtener cliente
                const clienteDoc = await admin
                    .firestore()
                    .collection("usuarios")
                    .doc(after.clienteId)
                    .get();

                if (!clienteDoc.exists) {
                    console.log("Cliente no encontrado");
                    return null;
                }

                const cliente = clienteDoc.data();

                if (!cliente || !cliente.fcmToken) {
                    console.log("Cliente no tiene FCM token");
                    return null;
                }

                // Enviar notificación con datos validados
                const descripcion =
                    (after.descripcion && typeof after.descripcion === "string")
                        ? after.descripcion.substring(0, 100)
                        : "Servicio de limpieza";

                const message = {
                    notification: {
                        title: "✅ Trabajo Completado",
                        body: `El trabajo "${descripcion}" ha sido completado`,
                    },
                    data: {
                        url: "/client/dashboard",
                        type: "job_completed",
                        jobId: context.params.jobId,
                    },
                    token: cliente.fcmToken,
                    webpush: {
                        fcmOptions: {
                            link: "/client/dashboard",
                        },
                        notification: {
                            icon: "/icon-192x192.png",
                            badge: "/icon-192x192.png",
                        },
                    },
                };

                await admin.messaging().send(message);
                console.log("Notificación enviada al cliente");

                return null;
            } catch (error) {
                console.error("Error en onJobCompleted:", error);
                return null;
            }
        }

        return null;
    });

/**
 * Trigger automático cuando se asigna una nueva tarea a empleado
 */
export const onTaskAssigned = functions.firestore
    .document("tareas/{taskId}")
    .onCreate(async (snap, context) => {
        const task = snap.data();

        if (!task || !task.empleadoId) {
            console.log("Tarea sin empleado asignado");
            return null;
        }

        console.log(
            "Nueva tarea asignada a empleado:",
            task.empleadoId,
        );

        try {
            // Obtener empleado
            const empleadoDoc = await admin
                .firestore()
                .collection("usuarios")
                .doc(task.empleadoId)
                .get();

            if (!empleadoDoc.exists) {
                console.log("Empleado no encontrado");
                return null;
            }

            const empleado = empleadoDoc.data();

            if (!empleado || !empleado.fcmToken) {
                console.log("Empleado no tiene FCM token");
                return null;
            }

            // Enviar notificación
            const message = {
                notification: {
                    title: "📋 Nueva Tarea Asignada",
                    body: `Tarea: ${task.titulo || "Nueva tarea"} - ${
                        task.ubicacion || "Sin ubicación"
                    }`,
                },
                data: {
                    url: "/employee/route",
                    type: "new_task",
                    taskId: context.params.taskId,
                },
                token: empleado.fcmToken,
                webpush: {
                    fcmOptions: {
                        link: "/employee/route",
                    },
                    notification: {
                        icon: "/icon-192x192.png",
                        badge: "/icon-192x192.png",
                    },
                },
            };

            await admin.messaging().send(message);
            console.log("Notificación enviada al empleado");

            return null;
        } catch (error) {
            console.error("Error en onTaskAssigned:", error);
            return null;
        }
    });
