export const CHART_COLORS = {
    brandGreen: "#10b981",
    brandGreenLight: "rgba(16, 185, 129, 0.3)",
    brandGreenTransparent: "rgba(16, 185, 129, 0)",
    brandBlue: "#3B82F6",
    textGray: "#6B7280",
    bgWhite: "#ffffff",
    gridStroke: "#e5e7eb",
};

export const CHART_CONFIG = {
    axis: {
        fontSize: 12,
        fill: CHART_COLORS.textGray,
        tickLine: false,
        axisLine: false,
    },
    grid: {
        strokeDasharray: "3 3",
        vertical: false,
        stroke: CHART_COLORS.gridStroke,
    },
    tooltip: {
        contentStyle: {
            backgroundColor: CHART_COLORS.bgWhite,
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
        cursor: { fill: "transparent" },
    },
    margin: {
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
    },
    bar: {
        radius: [4, 4, 0, 0] as [number, number, number, number],
        barSize: 40,
    },
    area: {
        strokeWidth: 2,
        fillOpacity: 1,
    },
};
