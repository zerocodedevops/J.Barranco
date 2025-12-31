import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
    collection,
    getCountFromServer,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { ItemInventario } from "../types";

interface DashboardStats {
    quejasPendientes: number;
    solicitudesExtra: number;
    observacionesNuevas: number;
    tareasPorAsignar: number;
    stockBajo: number;
}

interface UseDashboardStatsReturn {
    stats: DashboardStats;
    loading: boolean;
    error: string | null;
}

export function useDashboardStats(): UseDashboardStatsReturn {
    const [stats, setStats] = useState<DashboardStats>({
        quejasPendientes: 0,
        solicitudesExtra: 0,
        observacionesNuevas: 0,
        tareasPorAsignar: 0,
        stockBajo: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Contar tickets (quejas/incidencias) con estado "abierto" o "en_progreso"
                const qQuejas = query(
                    collection(db, "tickets"),
                    where("estado", "in", ["abierto", "en_progreso"]),
                );
                // 2. Contar extras pendientes (Solicitudes Extra que requieren atención)
                const qExtras = query(
                    collection(db, "extras"),
                    where("estado", "in", [
                        "solicitado",
                        "presupuestado",
                        "presupuesto_aceptado",
                    ]),
                );
                // 3. Contar trabajos (observaciones) que tienen texto en el campo
                const qObservaciones = query(
                    collection(db, "trabajos"),
                    where("observaciones", "!=", ""),
                );
                // 4. Contar tareas pendientes de asignar (empleadoId vacío)
                const qPorAsignar = query(
                    collection(db, "trabajos"),
                    where("empleadoId", "==", ""),
                    where("estado", "==", "pendiente"),
                );

                const [
                    quejasSnap,
                    extrasSnap,
                    observacionesSnap,
                    porAsignarSnap,
                    inventorySnap,
                ] = await Promise.all([
                    getCountFromServer(qQuejas),
                    getCountFromServer(qExtras),
                    getCountFromServer(qObservaciones),
                    getCountFromServer(qPorAsignar),
                    getDocs(collection(db, "inventario")),
                ]);

                // Calcular stock bajo en cliente
                const lowStockCount = inventorySnap.docs.reduce((acc, doc) => {
                    const data = doc.data() as ItemInventario;
                    const stockMin = data.stockMinimo ?? 5;
                    return data.cantidad < stockMin ? acc + 1 : acc;
                }, 0);

                setStats({
                    quejasPendientes: quejasSnap.data().count,
                    solicitudesExtra: extrasSnap.data().count,
                    observacionesNuevas: observacionesSnap.data().count,
                    tareasPorAsignar: porAsignarSnap.data().count,
                    stockBajo: lowStockCount,
                });
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : "Error desconocido";
                console.error(
                    "Error al cargar estadísticas:",
                    err,
                );
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
}
