import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, CHART_CONFIG } from "../../../constants/chartConfig";

interface ChartDataItem {
  name: string;
  value: number;
}

interface AnnualRevenueChartProps {
  readonly data: ChartDataItem[];
}

function AnnualRevenueChart({ data }: AnnualRevenueChartProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin/accounting?tab=ingresos")}
      className="w-full text-left bg-white p-6 rounded-lg shadow h-[400px] cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
      aria-label="Ver detalle de ingresos anuales"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Ingresos Anuales</h3>
        <span className="text-xs text-gray-400">Ver detalle &rarr;</span>
      </div>
      <div className="h-[300px]">
        {data.length > 0
          ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={CHART_CONFIG.margin}
              >
                <CartesianGrid {...CHART_CONFIG.grid} />
                <XAxis
                  dataKey="name"
                  {...CHART_CONFIG.axis}
                  dy={10}
                />
                <YAxis
                  {...CHART_CONFIG.axis}
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip
                  cursor={CHART_CONFIG.tooltip.cursor}
                  contentStyle={CHART_CONFIG.tooltip.contentStyle}
                  formatter={(value: number) => [`${value} €`, "Ingresos"]}
                />
                <Bar
                  dataKey="value"
                  fill={CHART_COLORS.brandBlue}
                  radius={CHART_CONFIG.bar.radius}
                  barSize={CHART_CONFIG.bar.barSize}
                />
              </BarChart>
            </ResponsiveContainer>
          )
          : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No hay datos disponibles
            </div>
          )}
      </div>
    </button>
  );
}

export default AnnualRevenueChart;
