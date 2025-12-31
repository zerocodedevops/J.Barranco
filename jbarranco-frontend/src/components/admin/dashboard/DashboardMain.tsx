import { useNavigate } from "react-router-dom";
import {
  ArchiveBoxXMarkIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

// Importamos los hooks personalizados
import { useDashboardStats } from "../../../hooks/useDashboardStats";
import { useDashboardCharts } from "../../../hooks/useDashboardCharts";

import RevenueChart from "./RevenueChart";
import AnnualRevenueChart from "./AnnualRevenueChart";
import ExpensesSummary from "./ExpensesSummary";

// Importar Skeletons
import {
  ChartSkeleton,
  DashboardGridSkeleton,
} from "../../common/skeletons/DashboardSkeleton";

// Mapeo de iconos para las estadísticas
const statsConfig = [
  {
    name: "Quejas Pendientes",
    key: "quejasPendientes",
    icon: ExclamationTriangleIcon,
    color: "bg-red-500",
  },
  {
    name: "Solicitudes Extra",
    key: "solicitudesExtra",
    icon: PlusCircleIcon,
    color: "bg-orange-500",
  },
  {
    name: "Observaciones",
    key: "observacionesNuevas",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-blue-500",
  },
  {
    name: "Tareas por Asignar",
    key: "tareasPorAsignar",
    icon: ClipboardDocumentListIcon,
    color: "bg-yellow-500",
  },
  {
    name: "Stock Bajo (Alerta)",
    key: "stockBajo",
    icon: ArchiveBoxXMarkIcon,
    color: "bg-red-600",
  },
];

function DashboardMain() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { data: chartsData, loading: chartsLoading } = useDashboardCharts();

  // Mapeo para saber a qué URL ir según la clave de la estadística
  const navigationMap = {
    quejasPendientes: "/admin/complaints",
    solicitudesExtra: "/admin/extra-jobs",
    observacionesNuevas: "/admin/observations",
    tareasPorAsignar: "/admin/routes",
    stockBajo: "/admin/inventory",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Panel Financiero y Control
      </h2>

      {/* Contadores de Alertas (KPIs Operativos) */}
      {statsLoading
        ? <DashboardGridSkeleton cards={4} />
        : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            {statsConfig.map((item) => (
              <button
                key={item.key}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                onClick={() =>
                  navigate(
                    navigationMap[item.key as keyof typeof navigationMap],
                  )}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 ${item.color} rounded-md p-3`}
                    >
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
                          {stats[item.key as keyof typeof stats]}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

      {/* Sección ANÁLISIS FINANCIERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Análisis de Ingresos
          </h3>
          <div className="bg-white shadow rounded-lg p-4">
            {chartsLoading ? <ChartSkeleton /> : (
              <RevenueChart
                data={chartsData.revenueData}
                totalRevenue={chartsData.totalRevenue}
              />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ingresos Anuales
          </h3>
          {chartsLoading
            ? <ChartSkeleton />
            : <AnnualRevenueChart data={chartsData.annualRevenueData} />}
        </div>
      </div>

      {/* Sección GASTOS */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Control de Gastos (Estimado)
      </h3>
      {chartsLoading
        ? <DashboardGridSkeleton cards={4} />
        : (
          <div className="mb-8">
            <ExpensesSummary data={chartsData.expensesData} />
          </div>
        )}
    </div>
  );
}

export default DashboardMain;
