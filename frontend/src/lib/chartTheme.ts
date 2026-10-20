export const chartTheme = {
  colors: {
    primary: "#5409DA",       // Color 1: Deep Royal Violet
    primaryLight: "#4E71FF",  // Color 2: Royal Cobalt Blue
    accent: "#8DD8FF",        // Color 3: Sky Cyan
    highlight: "#BBFBFF",     // Color 4: Ice Mint Aqua
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    muted: "#64748B",
    grid: "#F1F5F9",
    axis: "#94A3B8",
  },
  tooltipStyle: {
    backgroundColor: "#0E0821",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "12px",
    padding: "8px 12px",
    border: "1px solid rgba(141, 216, 255, 0.3)",
    boxShadow: "0 10px 20px -3px rgba(84, 9, 218, 0.3)",
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
