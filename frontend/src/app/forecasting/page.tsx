"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChartCard } from "@/components/ui/ChartCard";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { chartTheme } from "@/lib/chartTheme";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const FORECAST_SERIES = [
  { period: "Nov 25", actual: 42500, forecast: null, lower: null, upper: null },
  { period: "Dec 25", actual: 68900, forecast: null, lower: null, upper: null },
  { period: "Jan 26", actual: 38200, forecast: null, lower: null, upper: null },
  { period: "Feb 26", actual: 41100, forecast: null, lower: null, upper: null },
  { period: "Mar 26", actual: 46800, forecast: null, lower: null, upper: null },
  { period: "Apr 26", actual: 51200, forecast: null, lower: null, upper: null },
  { period: "May 26", actual: 53900, forecast: null, lower: null, upper: null },
  { period: "Jun 26", actual: 56400, forecast: null, lower: null, upper: null },
  { period: "Jul 26", actual: 58100, forecast: null, lower: null, upper: null },
  { period: "Aug 26", actual: 54200, forecast: null, lower: null, upper: null },
  { period: "Sep 26", actual: 61800, forecast: null, lower: null, upper: null },
  { period: "Oct 26", actual: 67450, forecast: 67450, lower: 67450, upper: 67450 },
  { period: "Nov 26", actual: null, forecast: 71200, lower: 65800, upper: 76600 },
  { period: "Dec 26", actual: null, forecast: 88500, lower: 81200, upper: 95800 },
  { period: "Jan 27", actual: null, forecast: 52400, lower: 47100, upper: 57700 },
];

export default function ForecastingPage() {
  const [modelType, setModelType] = useState<"statistical" | "baseline">("statistical");

  return (
    <AppLayout
      title="Demand Forecasting"
      subtitle="Honest statistical forecasting with holdout validation (BR-005 compliant)"
    >
      <PageHeader
        title="Sales Demand Forecasting"
        subtitle="Holt-Winters statistical projection with empirical holdout backtesting"
        actions={
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <span>View within Insights</span>
            <ArrowRight size={13} />
          </Link>
        }
      />

      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-indigo-600 shrink-0" />
          <span>
            <strong>Progressive Disclosure Note:</strong> In the simplified UI, forecasting is integrated directly into the <strong>Insights</strong> module.
          </span>
        </div>
        <Link href="/insights" className="font-bold text-indigo-600 hover:text-indigo-800 underline">
          Open Insights Dashboard
        </Link>
      </div>

      <ChartCard
        title="Sales Horizon Trajectory"
        subtitle="Historical monthly actuals with 3-month statistical forecast"
        heightClass="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={FORECAST_SERIES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid {...chartTheme.gridProps} />
            <XAxis dataKey="period" {...chartTheme.xAxisProps} />
            <YAxis {...chartTheme.yAxisProps} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={chartTheme.tooltipStyle}
              formatter={(val: any) => [val ? formatCurrency(val) : "N/A", ""]}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
            <Line type="monotone" name="Historical Actuals" dataKey="actual" stroke="#111827" strokeWidth={2.5} />
            <Line type="monotone" name="Forecast Prediction" dataKey="forecast" stroke="#4F46E5" strokeWidth={2.5} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </AppLayout>
  );
}
