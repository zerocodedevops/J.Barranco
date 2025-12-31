import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { getClients } from "../firebase/services";

export interface IncomeItem {
  id: string;
  fecha: Date;
  cliente: string;
  descripcion: string;
  importe: number;
}

export interface InventoryExpenseItem {
  id: string;
  producto: string;
  cantidad: number;
  costeUnitario: number;
  total: number;
}

export interface PayrollExpenseItem {
  id: string;
  empleado: string;
  puesto: string;
  costeMensual: number;
}

export interface TransactionItem {
  id: string;
  fecha: Date;
  tipo: "ingreso" | "gasto";
  concepto: string;
  importe: number;
  archivo?: { path: string; name: string };
}

export function useAccountingData() {
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [inventoryExpenses, setInventoryExpenses] = useState<
    InventoryExpenseItem[]
  >([]);
  const [payrollExpenses, setPayrollExpenses] = useState<PayrollExpenseItem[]>(
    [],
  );
  const [manualExpenses, setManualExpenses] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Ingresos (Trabajos Completados)
      const jobsRef = collection(db, "trabajos");
      const qJobs = query(jobsRef, where("estado", "==", "completado"));
      const jobsSnap = await getDocs(qJobs);
      const incomeList: IncomeItem[] = [];
      jobsSnap.forEach((doc) => {
        const data = doc.data();
        const clientName = data.clienteNombre || data.clienteId;
        const price = Number(data.precio);

        // SOLO mostramos si hay cliente válido y precio
        if (price > 0 && clientName && clientName !== "Cliente Desconocido") {
          incomeList.push({
            id: doc.id,
            fecha: data.fechaFin ? data.fechaFin.toDate() : new Date(),
            cliente: clientName,
            descripcion: data.tipoTrabajo || "Servicio",
            importe: price,
          });
        }
      });

      // 1.1 Fetch Cuotas Mensuales de Clientes (Recurrentes)
      const clients = await getClients();
      const currentMonth = new Date();
      clients.forEach((client) => {
        if (client.cuotaMensual && client.cuotaMensual > 0) {
          incomeList.push({
            id: `monthly_${client.id}_${currentMonth.getMonth()}`,
            fecha: currentMonth, // Asumimos ingreso este mes
            cliente: client.nombreComercial || client.nombre,
            descripcion: "Cuota Mensual (Recurrente)",
            importe: Number(client.cuotaMensual),
          });
        }
      });

      // 4. Fetch Movimientos Manuales (Transactions)
      const transRef = collection(db, "transactions");
      const transSnap = await getDocs(transRef);
      const manualExpList: TransactionItem[] = [];

      transSnap.forEach((doc) => {
        const data = doc.data();
        const item = {
          id: doc.id,
          fecha: data.fecha ? data.fecha.toDate() : new Date(),
          tipo: data.tipo,
          concepto: data.concepto,
          importe: Number(data.importe),
          archivo: data.archivo,
        };

        if (data.tipo === "ingreso") {
          // Añadir a ingresos como "Manual"
          incomeList.push({
            id: doc.id,
            fecha: item.fecha,
            cliente: "Manual / Varios",
            descripcion: item.concepto,
            importe: item.importe,
          });
        } else {
          manualExpList.push(item);
        }
      });

      // Sort Incomes
      incomeList.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      setIncomes(incomeList);

      // Sort Manual Expenses
      manualExpList.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      setManualExpenses(manualExpList);

      // 2. Fetch Gastos Inventario
      const invRef = collection(db, "inventario");
      const invSnap = await getDocs(invRef);
      const invList: InventoryExpenseItem[] = [];
      invSnap.forEach((doc) => {
        const data = doc.data();
        const cantidad = Number(data.cantidad) || 0;
        const costeUnitario = Number(data.precio) || 0;

        // Solo mostrar si tiene coste real
        if (cantidad > 0 && costeUnitario > 0) {
          invList.push({
            id: doc.id,
            producto: data.producto || "Ítem",
            cantidad: cantidad,
            costeUnitario: costeUnitario,
            total: cantidad * costeUnitario,
          });
        }
      });
      setInventoryExpenses(invList);

      // 3. Fetch Gastos Nómina
      const empRef = collection(db, "empleados");
      const empSnap = await getDocs(empRef);
      const payList: PayrollExpenseItem[] = [];
      empSnap.forEach((doc) => {
        const data = doc.data();
        const hourlyRate = Number(data.costeHora) || 0;
        // Usar horas mensuales definidas o 160 (hábiles estándar) por defecto
        const monthlyHours = Number(data.horasMensuales) || 160;

        // Solo mostrar si tiene coste hora definido
        if (hourlyRate > 0) {
          payList.push({
            id: doc.id,
            empleado: `${data.nombre} ${data.apellidos || ""}`,
            puesto: data.especialidad || "Operario",
            costeMensual: hourlyRate * monthlyHours,
          });
        }
      });
      setPayrollExpenses(payList);
    } catch (error) {
      console.error("Error fetching accounting data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    incomes,
    inventoryExpenses,
    payrollExpenses,
    manualExpenses,
    loading,
    refreshData: fetchData,
  };
}
