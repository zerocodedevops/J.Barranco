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

export interface ClientProfitability {
    clientId: string;
    clientName: string;
    revenue: number; // Transactions + Monthly Fee (if applicable for the period)
    laborCost: number;
    materialCost: number;
    totalCost: number;
    profit: number;
    margin: number;
}

const parseHourlyRate = (rate: string | number | undefined): number => {
    if (typeof rate === "string") {
        return Number.parseFloat(rate.replace(",", ".")) || 0;
    }
    return Number(rate) || 0;
};

// Helper to calculate labor cost per client to reduce complexity
const calculateLaborCost = (
    client: Cliente,
    clientWorks: Trabajo[],
    employeeMap: Map<string, number>,
): number => {
    // A. Actual Cost from Completed Works
    const actualCost = clientWorks.reduce((sum, work) => {
        const empCost = work.empleadoId
            ? (employeeMap.get(work.empleadoId) || 0)
            : 0;
        return sum + (empCost * 1);
    }, 0);

    // B. Estimated Contract Cost (if applicable)
    let estimatedCost = 0;
    const hasContractDays = Array.isArray(client.diasContrato) &&
        client.diasContrato.length > 0;

    if (hasContractDays && client.empleadoAsignadoId) {
        const rawRate = employeeMap.get(client.empleadoAsignadoId);
        // Robust check: if rate is 0, maybe the ID lookup failed?
        // We rely on the map being populated with all ID variants.
        let hourlyRate = Number(rawRate) || 0;
        if (Number.isNaN(hourlyRate)) hourlyRate = 0;

        const weeklyHours = (client.diasContrato?.length || 0) * 1;
        estimatedCost = weeklyHours * 4.33 * hourlyRate;
    }

    // Use the GREATER of Actual vs Estimated.
    // This ensures that:
    // 1. If contract is active but few jobs done (start of month), we show Full Projected Cost.
    // 2. If actual jobs exceed contract (overtime/extras), we show Actual Cost.
    // This solves the user issue "Only subtracts one service cost instead of all contracted services".
    return Math.max(actualCost, estimatedCost);
};

// Pure helper function to calculate single client profitability
// Extracted to solve "nesting > 4" lint error
const calculateClientProfitability = (
    client: Cliente,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactions: any[], // using any to avoid strict type refactor on tx for now
    works: Trabajo[],
    requests: MaterialRequest[],
    employeeMap: Map<string, number>,
    priceMap: Map<string, number>,
): ClientProfitability => {
    // 1. Revenue
    const clientTx = transactions
        .filter((tx) =>
            tx.entidad === client.nombre ||
            tx.clienteId === client.id
        )
        .reduce((sum, tx) => sum + (tx.importe || 0), 0);
    const totalRevenue = clientTx + (client.cuotaMensual || 0);

    // 2. Labor Cost
    const clientWorks = works.filter((w) => w.clienteId === client.id);
    const laborCost = calculateLaborCost(client, clientWorks, employeeMap);

    // 3. Material Cost
    const clientReqs = requests.filter((r) => r.clienteId === client.id);
    const materialCost = clientReqs.reduce((sum, req) => {
        const price = priceMap.get(req.producto) || 0;
        return sum + (req.cantidad * price);
    }, 0);

    const totalCost = laborCost + materialCost;
    const profit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
        clientId: client.id,
        clientName: client.nombre,
        revenue: totalRevenue,
        laborCost,
        materialCost,
        totalCost,
        profit,
        margin,
    };
};

export const useClientProfitability = () => {
    const [data, setData] = useState<ClientProfitability[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const calculateData = async () => {
            try {
                // 1. Fetch Data
                const [
                    clientsSnap,
                    txSnap,
                    worksSnap,
                    empsSnap,
                    reqSnap,
                    itemsSnap,
                ] = await Promise.all([
                    getDocs(collection(db, "clientes")),
                    getDocs(
                        query(
                            collection(db, "transactions"),
                            where("tipo", "==", "ingreso"),
                        ),
                    ),
                    getDocs(
                        query(
                            collection(db, "trabajos"),
                            where("estado", "==", "completado"),
                        ),
                    ),
                    getDocs(collection(db, "empleados")),
                    getDocs(
                        query(
                            collection(db, "solicitudes_material"),
                            where("estado", "==", "aprobada"),
                        ),
                    ),
                    getDocs(collection(db, "inventario")),
                ]);

                // 2. Process Maps & Arrays
                const clients = clientsSnap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                })) as Cliente[];

                const employeeMap = new Map<string, number>();
                empsSnap.docs.forEach((doc) => {
                    const e = doc.data() as Empleado;
                    const rate = parseHourlyRate(e.costeHora);
                    employeeMap.set(doc.id, rate);
                    if (e.id) employeeMap.set(e.id, rate);
                    if (e.uid) employeeMap.set(e.uid, rate);
                });

                const priceMap = new Map<string, number>();
                itemsSnap.docs.forEach((doc) => {
                    const i = doc.data() as ItemInventario;
                    priceMap.set(i.producto, i.precio || 0);
                });

                const transactions = txSnap.docs.map((d) => d.data());
                const works = worksSnap.docs.map((d) => d.data() as Trabajo);
                const requests = reqSnap.docs.map((d) =>
                    d.data() as MaterialRequest
                );

                // 3. Build Report (Delegated to Helper)
                const report: ClientProfitability[] = clients.map((client) =>
                    calculateClientProfitability(
                        client,
                        transactions,
                        works,
                        requests,
                        employeeMap,
                        priceMap,
                    )
                );

                report.sort((a, b) => b.profit - a.profit);
                setData(report);
                setLoading(false);
            } catch (err) {
                console.error("Error calculating client profitability:", err);
                setError("Error al calcular rentabilidad por cliente");
                setLoading(false);
            }
        };

        calculateData();
    }, []);

    return { data, loading, error };
};
