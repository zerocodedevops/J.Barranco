import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import {
    Cliente,
    Empleado,
    ItemInventario,
    MaterialRequest,
    Trabajo,
} from "../types";

export interface ProfitabilityData {
    totalRevenue: number;
    totalLaborCost: number;
    totalMaterialCost: number;
    netProfit: number;
    profitMargin: number; // Porcentaje
    estimatedMonthlyRevenue: number; // New field for recurrent revenue
    loading: boolean;
    error: string | null;
}

export const useProfitability = () => {
    const [data, setData] = useState<ProfitabilityData>({
        totalRevenue: 0,
        totalLaborCost: 0,
        totalMaterialCost: 0,
        netProfit: 0,
        profitMargin: 0,
        estimatedMonthlyRevenue: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const calculateProfitability = async () => {
            try {
                // Fechas Mes Actual
                const now = new Date();
                const startOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                );
                const endOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0,
                );

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isInCurrentMonth = (timestamp: any) => {
                    if (!timestamp) return false;
                    const date = timestamp.toDate
                        ? timestamp.toDate()
                        : new Date(timestamp);
                    return date >= startOfMonth && date <= endOfMonth;
                };

                // 1. Ingresos Manuales (Solo Mes Actual)
                const transactionsRef = collection(db, "transactions");
                const qTransactions = query(
                    transactionsRef,
                    where("tipo", "==", "ingreso"),
                );
                const transactionsSnap = await getDocs(qTransactions);
                const manualIncome = transactionsSnap.docs.reduce(
                    (acc, doc) => {
                        const data = doc.data();
                        if (isInCurrentMonth(data.fecha)) {
                            return acc + (Number(data.importe) || 0);
                        }
                        return acc;
                    },
                    0,
                );

                // 2. Ingresos Trabajos Completados (Solo Mes Actual)
                const worksRef = collection(db, "trabajos");
                const qWorks = query(
                    worksRef,
                    where("estado", "==", "completado"),
                );
                const worksSnap = await getDocs(qWorks);
                const worksIncome = worksSnap.docs.reduce((acc, doc) => {
                    const data = doc.data() as Trabajo;
                    // Usar fechaFin o fecha como fallback
                    if (isInCurrentMonth(data.fechaFin || data.fecha)) {
                        return acc + (Number(data.precio) || 0);
                    }
                    return acc;
                }, 0);

                // 3. Cuotas Mensuales (Fijo cada mes)
                const clientsRef = collection(db, "clientes");
                const clientsSnap = await getDocs(clientsRef);
                const monthlyRecurringRevenue = clientsSnap.docs.reduce(
                    (acc, doc) => {
                        const client = doc.data() as Cliente;
                        return acc + (Number(client.cuotaMensual) || 0);
                    },
                    0,
                );

                // Total Ingresos (Mes)
                const totalRevenue = manualIncome + worksIncome +
                    monthlyRecurringRevenue;

                // 4. Coste Nómina (Fijo cada mes: CosteHora * HorasMensuales)
                const employeesRef = collection(db, "empleados");
                const employeesSnap = await getDocs(employeesRef);

                const totalLaborCost = employeesSnap.docs.reduce((acc, doc) => {
                    const e = doc.data() as Empleado;
                    const hours = e.horasMensuales || 160;
                    return acc + ((e.costeHora || 0) * hours);
                }, 0);

                // 5. Coste Materiales (Solo Mes Actual)
                const requestsRef = collection(db, "solicitudes_material");
                const qRequests = query(
                    requestsRef,
                    where("estado", "==", "aprobada"),
                );
                const requestsSnap = await getDocs(qRequests);
                const requests = requestsSnap.docs.map((doc) =>
                    doc.data()
                ) as MaterialRequest[];

                const itemsRef = collection(db, "inventario");
                const itemsSnap = await getDocs(itemsRef);
                const priceMap = new Map<string, number>();
                itemsSnap.docs.forEach((doc) => {
                    const item = doc.data() as ItemInventario;
                    priceMap.set(item.producto, item.precio || 0);
                });

                let totalMaterialCost = 0;
                requests.forEach((req) => {
                    if (
                        isInCurrentMonth(
                            req.fechaResolucion || req.fechaSolicitud,
                        )
                    ) {
                        const price = priceMap.get(req.producto) || 0;
                        totalMaterialCost += req.cantidad * price;
                    }
                });

                // 6. Totals
                const totalCosts = totalLaborCost + totalMaterialCost;
                const netProfit = totalRevenue - totalCosts;
                const profitMargin = totalRevenue > 0
                    ? (netProfit / totalRevenue) * 100
                    : 0;

                setData({
                    totalRevenue,
                    totalLaborCost,
                    totalMaterialCost,
                    netProfit,
                    profitMargin,
                    estimatedMonthlyRevenue: monthlyRecurringRevenue,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error("Error calculating profitability:", error);
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    error: "Error al calcular la rentabilidad",
                }));
            }
        };

        calculateProfitability();
    }, []);

    return data;
};
