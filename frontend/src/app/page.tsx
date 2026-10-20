"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DateRangeSelect } from "@/components/ui/DateRangeSelect";
import { InsightCard } from "@/components/ui/InsightCard";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { chartTheme } from "@/lib/chartTheme";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Receipt,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    primaryKpis,
    extendedKpis,
    revenueTrends,
    categoryData,
    recentSales,
    topInsights,
    isLoading,
  } = useDashboardData();

  const [showExtendedKpis, setShowExtendedKpis] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Column configuration for Recent Sales table
  const salesColumns: Column<any>[] = [
    {
      key: "id",
      header: "Order ID",
      render: (row) => (
        <span className="font-mono font-medium text-[#5409DA] bg-[#BBFBFF]/50 border border-[#8DD8FF]/40 px-1.5 py-0.5 rounded text-[11px]">
          {row.id}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "text-slate-500",
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) => (
        <span className="font-semibold text-slate-800">{row.customer}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (row) => (
        <span className="font-bold text-slate-900">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Executive overview and real-time business performance"
    >
      {/* 1. PageHeader with Welcome message & DateRangeSelect */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Jane Doe! Here is your business overview for this period."
        actions={
          <div className="flex items-center gap-2.5">
            <DateRangeSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
            <Link
              href="/reports"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white hover:from-[#4E71FF] hover:to-[#5409DA] shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              <Receipt size={14} />
              <span>Export</span>
            </Link>
          </div>
        }
      />

      {/* 2. Exactly 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={primaryKpis.revenue.title}
          value={primaryKpis.revenue.value}
          previousValue={primaryKpis.revenue.previousValue}
          growthPct={primaryKpis.revenue.growthPct}
          formula={primaryKpis.revenue.formula}
          icon={DollarSign}
        />
        <KpiCard
          title={primaryKpis.expenses.title}
          value={primaryKpis.expenses.value}
          previousValue={primaryKpis.expenses.previousValue}
          growthPct={primaryKpis.expenses.growthPct}
          formula={primaryKpis.expenses.formula}
          invertColor={true}
          icon={TrendingDown}
        />
        <KpiCard
          title={primaryKpis.netProfit.title}
          value={primaryKpis.netProfit.value}
          previousValue={primaryKpis.netProfit.previousValue}
          growthPct={primaryKpis.netProfit.growthPct}
          formula={primaryKpis.netProfit.formula}
          isEstimate={true}
          icon={Sparkles}
        />
        <KpiCard
          title={primaryKpis.totalSales.title}
          value={primaryKpis.totalSales.value}
          previousValue={primaryKpis.totalSales.previousValue}
          growthPct={primaryKpis.totalSales.growthPct}
          formula={primaryKpis.totalSales.formula}
          icon={ShoppingBag}
        />
      </div>

      {/* Progressive Disclosure: All 12 Central KPIs Toggle */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setShowExtendedKpis(!showExtendedKpis)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5409DA] hover:text-[#4E71FF] bg-[#BBFBFF]/40 hover:bg-[#BBFBFF]/70 border border-[#8DD8FF]/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Layers size={14} />
            <span>
              {showExtendedKpis
                ? "Hide additional 8 central KPIs"
                : "View all 12 reconciled financial KPIs"}
            </span>
            {showExtendedKpis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Reconciled against MySQL 8 transactions • Single central analytics layer
          </span>
        </div>

        {showExtendedKpis && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-100/60 border border-slate-200 animate-fade-in">
            {extendedKpis.map((kpi) => (
              <KpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                previousValue={kpi.previousValue}
                growthPct={kpi.growthPct}
                formula={kpi.formula}
                isEstimate={kpi.isEstimate}
                invertColor={kpi.invertColor}
                className="p-3.5 bg-white shadow-2xs"
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Exactly 2 Charts: Side by Side on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Overview (Line/Area) */}
        <ChartCard
          title="Revenue & Profit Overview"
          subtitle="Monthly net revenue and profit trajectory over 12 months"
          badge={
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +58.7% YoY
            </span>
          }
          heightClass="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTrends}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5409DA" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#4E71FF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8DD8FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartTheme.gridProps} />
              <XAxis dataKey="month" {...chartTheme.xAxisProps} />
              <YAxis
                {...chartTheme.yAxisProps}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                contentStyle={chartTheme.tooltipStyle}
                formatter={(val: any) => [formatCurrency(val), ""]}
              />
              <Area
                type="monotone"
                name="Net Revenue"
                dataKey="revenue"
                stroke="#5409DA"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revGrad)"
              />
              <Area
                type="monotone"
                name="Net Profit"
                dataKey="profit"
                stroke="#16A34A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sales by Category (Horizontal Bar) */}
        <ChartCard
          title="Sales by Category"
          subtitle="Revenue distribution and category market share"
          heightClass="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="catBarGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5409DA" />
                  <stop offset="100%" stopColor="#4E71FF" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis
                type="number"
                {...chartTheme.xAxisProps}
                axisLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
                width={110}
              />
              <Tooltip
                contentStyle={chartTheme.tooltipStyle}
                formatter={(v: any) => [formatCurrency(v), "Revenue"]}
              />
              <Bar dataKey="revenue" fill="url(#catBarGrad)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 4. Bottom Row: Recent Sales Table + Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Sales Table (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <DataTable
            title="Recent Sales"
            data={recentSales}
            columns={salesColumns}
            pageSize={6}
            searchPlaceholder="Search recent orders..."
            searchKey="customer"
            onRowClick={(order) => setSelectedOrder(order)}
            actions={
              <Link
                href="/sales"
                className="text-xs font-semibold text-[#5409DA] hover:text-[#4E71FF] flex items-center gap-1 transition-colors"
              >
                <span>View all sales</span>
                <ArrowRight size={13} />
              </Link>
            }
          />
        </div>

        {/* Business Insights (Top 3) (1 col on desktop) */}
        <div className="space-y-3 p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Business Insights
                </h3>
                <p className="text-xs text-slate-500">
                  Top rule-based recommendations
                </p>
              </div>
              <Link
                href="/insights"
                className="text-xs font-semibold text-[#5409DA] hover:text-[#4E71FF] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {topInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail SideDrawer (Progressive Disclosure) */}
      <SideDrawer
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details: ${selectedOrder.id}` : "Order Details"}
        subtitle="Complete transactional ledger breakdown"
        footer={
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
          >
            Done
          </button>
        }
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel:</span>
                <span className="font-medium text-slate-700">{selectedOrder.channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-700">{selectedOrder.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-900">Total Amount:</span>
                <span className="text-[#5409DA]">{formatCurrency(selectedOrder.amount)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Financial Verification
              </h4>
              <p className="text-[11px] text-slate-500">
                This transaction was committed with transactional isolation. Unit costs
                and discounts were captured at sale time.
              </p>
            </div>
          </div>
        )}
      </SideDrawer>
    </AppLayout>
  );
}
