import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/config";

import { Trabajo } from "../types";

// Removed local Job interface with [key: string]: any

interface ChartDataItem {
    name: string; // "Ene", "2024", etc.
    value: number;
}

interface JobDataItem {
    estado: string;
    count: number;
    fill: string;
}

interface ExpensesData {
    inventory: { monthly: number; annual: number };
    payroll: { monthly: number; annual: number };
    others: { monthly: number; annual: number };
}

interface DashboardChartsData {
    revenueData: ChartDataItem[];
    annualRevenueData: ChartDataItem[];
    expensesData: ExpensesData;
    jobsData: JobDataItem[];
    totalRevenue: number;
}

interface UseDashboardChartsReturn {
    data: DashboardChartsData;
    loading: boolean;
    error: string | null;
}

export function useDashboardCharts(): UseDashboardChartsReturn {
    const [data, setData] = useState<DashboardChartsData>({
        revenueData: [],
        annualRevenueData: [],
        expensesData: {
            inventory: { monthly: 0, annual: 0 },
            payroll: { monthly: 0, annual: 0 },
            others: { monthly: 0, annual: 0 },
        },
        jobsData: [],
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);

                // 1. Obtener Trabajos (Ingresos)
                const jobsQuery = query(collection(db, "trabajos")); // Traemos todos para calcular anuales correctamente
                const jobsSnapshot = await getDocs(jobsQuery);
                const jobs: Trabajo[] = jobsSnapshot.docs.map((doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    }) as Trabajo
                );

                // 2. Obtener Inventario (Gastos Material)
                const inventorySnapshot = await getDocs(
                    collection(db, "inventario"),
                );
                let totalStockItems = 0;
                inventorySnapshot.docs.forEach((doc) => {
                    const cant = Number(doc.data().cantidad) || 0;
                    totalStockItems += cant;
                });

                // 3. Obtener Empleados (Gastos Personal)
                const employeesSnapshot = await getDocs(
                    collection(db, "empleados"),
                );
                const totalEmployees = employeesSnapshot.size;

                // 4. Obtener Gastos Manuales (Transacciones)
                const transactionsSnapshot = await getDocs(
                    collection(db, "transactions"),
                );
                let manualMonthly = 0;
                let manualAnnual = 0;
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                transactionsSnapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (data.tipo === "gasto") {
                        const date = data.fecha
                            ? data.fecha.toDate()
                            : new Date();
                        const amount = Number(data.importe) || 0;

                        if (date.getFullYear() === currentYear) {
                            manualAnnual += amount;
                            if (date.getMonth() === currentMonth) {
                                manualMonthly += amount;
                            }
                        }
                    }
                });

                // --- CÁLCULOS ---

                // A) Ingresos Mensuales (Últimos 12 meses para ser más precisos o 6 como antes)
                // Mantendremos 6 meses como estaba, o 12 para mejor vista anual
                const monthlyRevenue: Record<string, number> = {};
                const monthNames = [
                    "Ene",
                    "Feb",
                    "Mar",
                    "Abr",
                    "May",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dic",
                ];

                // Inicializar últimos 6 meses
                for (let i = 5; i >= 0; i--) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    const key = `${monthNames[date.getMonth()]} ${
                        date.getFullYear().toString().slice(2)
                    }`;
                    monthlyRevenue[key] = 0;
                }

                // B) Ingresos Anuales
                const annualRevenue: Record<string, number> = {};
                annualRevenue[currentYear.toString()] = 0;
                annualRevenue[(currentYear - 1).toString()] = 0; // Año anterior comparativo

                // C) Jobs Status & Total Revenue
                const jobsByStatus: Record<string, number> = {
                    pendiente: 0,
                    "en proceso": 0,
                    completado: 0,
                };
                let totalRev = 0;

                jobs.forEach((job) => {
                    const jobDate = job.createdAt?.toDate() || new Date();
                    const yearKey = jobDate.getFullYear().toString();

                    // Estado
                    const estado = (job.estado || "pendiente").toLowerCase();
                    if (jobsByStatus[estado] !== undefined) {
                        jobsByStatus[estado]++;
                    }

                    // Cálculos financieros (solo completados con precio)
                    if (job.estado === "completado" && job.precio) {
                        const price = parseFloat(String(job.precio)) || 0;
                        totalRev += price;

                        // Mensual (Solo si entra en los keys generados - últimos 6 meses)
                        const monthKey = `${monthNames[jobDate.getMonth()]} ${
                            jobDate.getFullYear().toString().slice(2)
                        }`;
                        if (monthlyRevenue[monthKey] !== undefined) {
                            monthlyRevenue[monthKey] += price;
                        }

                        // Anual
                        if (annualRevenue[yearKey] !== undefined) {
                            annualRevenue[yearKey] += price;
                        }
                    }
                });

                // Formatear Mensual
                const revenueData: ChartDataItem[] = Object.entries(
                    monthlyRevenue,
                ).map(([name, value]) => ({
                    name,
                    value: Math.round(value * 100) / 100,
                }));

                // Formatear Anual
                const annualRevenueData: ChartDataItem[] = [
                    {
                        name: String(currentYear - 1),
                        value: Math.round(
                            (annualRevenue[String(currentYear - 1)] ?? 0) * 100,
                        ) / 100,
                    },
                    {
                        name: String(currentYear),
                        value: Math.round(
                            (annualRevenue[String(currentYear)] ?? 0) * 100,
                        ) / 100,
                    },
                ];

                // D) Gastos Simulados
                // Inventario: 25€ coste medio por item almacenado
                const COST_PER_ITEM = 25;
                const inventoryTotalValue = totalStockItems * COST_PER_ITEM;
                // Gasto mensual inventario: Simulamos que se repone un 10% del stock mensual
                const inventoryMonthlyExpense = inventoryTotalValue * 0.10;

                // Nómina: 1500€ coste empresa por empleado
                const PAYROLL_PER_EMPLOYEE = 1500;
                const payrollMonthly = totalEmployees * PAYROLL_PER_EMPLOYEE;
                const payrollAnnual = payrollMonthly * 12; // Proyección anual

                const expensesData: ExpensesData = {
                    inventory: {
                        monthly: Math.round(inventoryMonthlyExpense),
                        annual: Math.round(inventoryTotalValue * 1.2), // Coste anual algo mayor a valor stock actual
                    },
                    payroll: {
                        monthly: Math.round(payrollMonthly),
                        annual: Math.round(payrollAnnual),
                    },
                    others: {
                        monthly: Math.round(manualMonthly),
                        annual: Math.round(manualAnnual),
                    },
                };

                const jobsData: JobDataItem[] = [
                    {
                        estado: "Pendiente",
                        count: jobsByStatus.pendiente ?? 0,
                        fill: "#f59e0b",
                    },
                    {
                        estado: "En Proceso",
                        count: jobsByStatus["en proceso"] ?? 0,
                        fill: "#3b82f6",
                    },
                    {
                        estado: "Completado",
                        count: jobsByStatus.completado ?? 0,
                        fill: "#10b981",
                    },
                ];

                setData({
                    revenueData,
                    annualRevenueData,
                    expensesData,
                    jobsData,
                    totalRevenue: Math.round(totalRev * 100) / 100,
                });
                setError(null);
            } catch (err) {
                console.error("Error fetching chart data:", err);
                setError(
                    err instanceof Error ? err.message : "Error desconocido",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    return { data, loading, error };
}
