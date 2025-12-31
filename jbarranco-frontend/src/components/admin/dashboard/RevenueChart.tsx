import { useNavigate } from "react-router-dom";
import {
    Area,
    AreaChart,
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

interface RevenueChartProps {
    readonly data: ChartDataItem[];
    readonly totalRevenue: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        payload: {
            name: string;
        };
    }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
        const item = payload[0];
        if (!item) return null;
        return (
            <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                <p className="text-sm font-medium text-gray-900">
                    {item.payload?.name}
                </p>
                <p className="text-sm text-brand-green font-semibold">
                    {item.value}€
                </p>
            </div>
        );
    }
    return null;
};

function RevenueChart({ data, totalRevenue }: RevenueChartProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/admin/accounting?tab=ingresos")}
            className="w-full text-left bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Ver detalle de ingresos mensuales"
        >
            <div className="mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Ingresos Mensuales
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Total:{" "}
                            <span className="font-bold text-brand-green">
                                {totalRevenue}€
                            </span>
                        </p>
                    </div>
                    <span className="text-xs text-gray-400">
                        Ver detalle &rarr;
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={CHART_CONFIG.margin}
                >
                    <defs>
                        <linearGradient
                            id="colorIngresos"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={CHART_COLORS.brandGreen}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor={CHART_COLORS.brandGreen}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={CHART_COLORS.gridStroke}
                    />
                    <XAxis
                        dataKey="name"
                        {...CHART_CONFIG.axis}
                    />
                    <YAxis
                        {...CHART_CONFIG.axis}
                        tickFormatter={(value) => `${value}€`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={CHART_COLORS.brandGreen}
                        strokeWidth={CHART_CONFIG.area.strokeWidth}
                        fillOpacity={CHART_CONFIG.area.fillOpacity}
                        fill="url(#colorIngresos)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </button>
    );
}

export default RevenueChart;
