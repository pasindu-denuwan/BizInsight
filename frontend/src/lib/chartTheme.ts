export const chartTheme = {
  colors: {
    primary: "#4F46E5",
    primaryLight: "#818CF8",
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    muted: "#6B7280",
    grid: "#F1F5F9",
    axis: "#94A3B8",
  },
  tooltipStyle: {
    backgroundColor: "#111827",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "12px",
    padding: "8px 12px",
    border: "1px solid #1F2937",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
  },
  gridProps: {
    strokeDasharray: "3 3",
    stroke: "#F1F5F9",
  },
  xAxisProps: {
    tickLine: false,
    axisLine: { stroke: "#E2E8F0" },
    tick: { fill: "#6B7280", fontSize: 11 },
  },
  yAxisProps: {
    tickLine: false,
    axisLine: false,
    tick: { fill: "#6B7280", fontSize: 11 },
  },
};
