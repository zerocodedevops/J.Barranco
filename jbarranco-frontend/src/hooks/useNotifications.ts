import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { ItemInventario } from "../types";

export interface Notification {
    id: string;
    message: string;
    timestamp: Timestamp;
    link: string;
    type:
        | "comunicacion"
        | "extra"
        | "observacion"
        | "reposicion"
        | "stock_bajo"
        | "tarea_pendiente"
        | "ticket";
}

export function useNotifications(): Notification[] {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [sources, setSources] = useState({
        comunicaciones: [] as Notification[],
        extras: [] as Notification[],
        observaciones: [] as Notification[],
        reposiciones: [] as Notification[],
        stockBajo: [] as Notification[],
        tareasPendientes: [] as Notification[],
        tickets: [] as Notification[],
    });

    useEffect(() => {
        // 1. Query Comunicaciones (Quejas/ Sugerencias legacy)
        const qComunicaciones = query(
            collection(db, "comunicaciones"),
            where("estado", "in", ["recibido", "en_progreso"]),
            orderBy("fechaCreacion", "desc"),
            limit(10),
        );

        // 2. Query Extras (Solicitudes de presupuesto y Aceptados)
        const qExtras = query(
            collection(db, "extras"),
            where("estado", "in", ["pendiente", "presupuesto_aceptado"]),
            limit(10),
        );

        // 3. Query Observaciones (Notas en trabajos recientes)
        const qObservaciones = query(
            collection(db, "trabajos"),
            where("observaciones", "!=", ""),
            orderBy("fecha", "desc"),
            limit(10),
        );

        // 4. Query Reposiciones (Solicitudes de material)
        const qReposiciones = query(
            collection(db, "reposicion"),
            where("estado", "==", "pendiente"),
            orderBy("fecha", "desc"),
            limit(10),
        );

        // 5. Query Stock Bajo
        const qInventario = query(collection(db, "inventario"));

        // 6. Query Tareas Pendientes sin asignar
        const qTareas = query(
            collection(db, "trabajos"),
            where("empleadoId", "==", ""),
            where("estado", "==", "pendiente"),
            limit(10),
        );

        // 7. Query Tickets
        const qTickets = query(
            collection(db, "tickets"),
            where("estado", "in", ["abierto", "en_progreso", "pendiente"]),
            orderBy("fechaCreacion", "desc"),
            limit(10),
        );

        const handleSnapshotError = (source: string, error: Error) => {
            console.error(`Error in ${source} listener:`, error);
            if (error?.message?.includes("index")) {
                toast.error(
                    `Falta índice en DB para ${source}. Revisa la consola.`,
                );
            }
        };

        const unsubComs = onSnapshot(
            qComunicaciones,
            (snap) => {
                const items = snap.docs.map((doc) => ({
                    id: `com_${doc.id}`,
                    message: `Nueva ${doc.data().tipo}: ${doc.data().asunto}`,
                    timestamp: doc.data().fechaCreacion,
                    link: "/admin/complaints",
                    type: "comunicacion",
                } as Notification));
                setSources((prev) => ({ ...prev, comunicaciones: items }));
            },
            (error) => handleSnapshotError("Comunicaciones", error),
        );

        const unsubExtras = onSnapshot(
            qExtras,
            (snap) => {
                const items = snap.docs.map((doc) => {
                    const data = doc.data();
                    const isAccepted = data.estado === "presupuesto_aceptado";
                    return {
                        id: `ext_${doc.id}`,
                        message: isAccepted
                            ? `¡Presupuesto Aceptado! ${
                                data.clienteNombre || "Cliente"
                            }`
                            : `Solicitud Extra: ${
                                data.descripcion?.substring(0, 20)
                            }...`,
                        timestamp: data.createdAt || data.fechaCreacion ||
                            Timestamp.now(),
                        link: "/admin/extra-jobs",
                        type: "extra",
                    } as Notification;
                });
                setSources((prev) => ({ ...prev, extras: items }));
            },
            (error) => handleSnapshotError("Extras", error),
        );

        const unsubObs = onSnapshot(
            qObservaciones,
            (snap) => {
                const items = snap.docs.map((doc) => ({
                    id: `obs_${doc.id}`,
                    message: `Observación en ${
                        doc.data().clienteNombre || "Tarea"
                    }`,
                    timestamp: doc.data().updatedAt || doc.data().fecha ||
                        Timestamp.now(),
                    link: "/admin/observations",
                    type: "observacion",
                } as Notification));
                setSources((prev) => ({ ...prev, observaciones: items }));
            },
            (error) => handleSnapshotError("Observaciones", error),
        );

        const unsubRepos = onSnapshot(
            qReposiciones,
            (snap) => {
                const items = snap.docs.map((doc) => ({
                    id: `rep_${doc.id}`,
                    message: `Solicitud Material: ${doc.data().producto}`,
                    timestamp: doc.data().fecha,
                    link: "/admin/inventory?tab=requests",
                    type: "reposicion",
                } as Notification));
                setSources((prev) => ({ ...prev, reposiciones: items }));
            },
            (error) => handleSnapshotError("Reposiciones", error),
        );

        const unsubInventario = onSnapshot(
            qInventario,
            (snap) => {
                const lowStockItems: Notification[] = [];
                snap.docs.forEach((doc) => {
                    const data = doc.data() as ItemInventario;
                    const stockMin = data.stockMinimo ?? 5;
                    const currentStock = data.cantidad ?? 0;

                    if (currentStock < stockMin) {
                        lowStockItems.push({
                            id: `stock_${doc.id}`,
                            message:
                                `Stock Bajo: ${data.producto} (${currentStock}/${stockMin})`,
                            timestamp: Timestamp.now(), // No tiene fecha de evento, usamos actual
                            link: "/admin/inventory",
                            type: "stock_bajo",
                        });
                    }
                });
                setSources((prev) => ({ ...prev, stockBajo: lowStockItems }));
            },
            (error) => handleSnapshotError("Inventario", error),
        );

        const unsubTareas = onSnapshot(
            qTareas,
            (snap) => {
                const items = snap.docs.map((doc) => ({
                    id: `task_${doc.id}`,
                    message: `Tarea sin asignar: ${
                        doc.data().descripcion || "Sin descripción"
                    }`,
                    timestamp: doc.data().createdAt || Timestamp.now(),
                    link: "/admin/routes",
                    type: "tarea_pendiente",
                } as Notification));
                setSources((prev) => ({ ...prev, tareasPendientes: items }));
            },
            (error) => handleSnapshotError("Tareas", error),
        );

        const unsubTickets = onSnapshot(
            qTickets,
            (snap) => {
                const items = snap.docs.map((doc) => ({
                    id: `tick_${doc.id}`,
                    message: `Ticket Nuevo: ${doc.data().asunto}`,
                    timestamp: doc.data().fechaCreacion,
                    link: "/admin/complaints",
                    type: "ticket",
                } as Notification));
                setSources((prev) => ({ ...prev, tickets: items }));
            },
            (error) => handleSnapshotError("Tickets", error),
        );

        return () => {
            unsubComs();
            unsubExtras();
            unsubObs();
            unsubRepos();
            unsubInventario();
            unsubTareas();
            unsubTickets();
        };
    }, []);

    useEffect(() => {
        const all = [
            ...sources.comunicaciones,
            ...sources.extras,
            ...sources.observaciones,
            ...sources.reposiciones,
            ...sources.stockBajo,
            ...sources.tareasPendientes,
            ...sources.tickets,
        ];

        // Ordenar por fecha descendente
        all.sort((a, b) => {
            const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
            const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
            return tB - tA;
        });

        setNotifications(all);
    }, [sources]);

    return notifications;
}
