import { useNavigate } from "react-router-dom";
import {
  ArchiveBoxIcon,
  DocumentTextIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface ExpensesData {
  inventory: { monthly: number; annual: number };
  payroll: { monthly: number; annual: number };
  others: { monthly: number; annual: number };
}

interface ExpensesSummaryProps {
  data: ExpensesData;
}

function ExpensesSummary({ data }: ExpensesSummaryProps) {
  const navigate = useNavigate();

  const cards = [
    {
      name: "Gasto Inventario (Mes)",
      amount: data.inventory.monthly,
      icon: ArchiveBoxIcon,
      color: "bg-orange-500",
      period: "Mes actual",
    },
    {
      name: "Gasto Inventario (Anual)",
      amount: data.inventory.annual,
      icon: ArchiveBoxIcon,
      color: "bg-orange-600",
      period: "Año en curso",
    },
    {
      name: "Nóminas (Mes)",
      amount: data.payroll.monthly,
      icon: UsersIcon,
      color: "bg-blue-500",
      period: "Último mes",
    },
    {
      name: "Nóminas (Anual)",
      amount: data.payroll.annual,
      icon: UsersIcon,
      color: "bg-blue-600",
      period: "Año en curso",
    },
    {
      name: "Gastos Empresa (Mes)",
      amount: data.others.monthly,
      icon: DocumentTextIcon,
      color: "bg-indigo-500",
      period: "Mes actual",
    },
    {
      name: "Gastos Empresa (Anual)",
      amount: data.others.annual,
      icon: DocumentTextIcon,
      color: "bg-indigo-600",
      period: "Año en curso",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate("/admin/accounting?tab=gastos")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {navigate(
                  "/admin/accounting?tab=gastos",
                );}
            }}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${item.color} rounded-md p-3`}>
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {item.amount.toLocaleString("es-ES")}€
                    </dd>
                    <dd className="text-xs text-gray-400 mt-1">
                      {item.period}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">
        * Gastos calculados en base a estimaciones estándar (Inventario:
        25€/item, Nómina: 1.500€/empleado).
      </p>
    </div>
  );
}

export default ExpensesSummary;
