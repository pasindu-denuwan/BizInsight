"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DateRangeSelect } from "@/components/ui/DateRangeSelect";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
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
  TrendingUp,
  Download,
  Filter,
  DollarSign,
  ShoppingBag,
  SlidersHorizontal,
  ArrowRight,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

const QUARTERLY_DATA = [
  { period: "Q1 2025", revenue: 118200, profit: 54100, orders: 1320, aov: 89.54 },
  { period: "Q2 2025", revenue: 142600, profit: 66300, orders: 1540, aov: 92.59 },
  { period: "Q3 2025", revenue: 158400, profit: 73800, orders: 1680, aov: 94.28 },
  { period: "Q4 2025", revenue: 194700, profit: 92400, orders: 2050, aov: 94.97 },
  { period: "Q1 2026", revenue: 126100, profit: 57600, orders: 1367, aov: 92.24 },
  { period: "Q2 2026", revenue: 161500, profit: 74400, orders: 1755, aov: 92.02 },
  { period: "Q3 2026", revenue: 174100, profit: 79400, orders: 1890, aov: 92.11 },
];

const SALES_CHANNEL_DATA = [
  { channel: "Online Webstore (Shopify)", revenue: 342100, orders: 3780, share: 51 },
  { channel: "Amazon Marketplace", revenue: 188400, orders: 2010, share: 28 },
  { channel: "Wholesale B2B Invoices", revenue: 94200, orders: 320, share: 14 },
  { channel: "Direct POS (Showroom)", revenue: 47100, orders: 620, share: 7 },
];

const TRANSACTIONS_DATA = [
  { id: "ORD-9421", date: "2026-10-14 18:24", customer: "Apex Tech Labs", channel: "Wholesale B2B", items: 14, total: 2450.0, status: "completed", paymentMethod: "Net 30 Invoice", tax: 196.0 },
  { id: "ORD-9420", date: "2026-10-14 17:05", customer: "Sophia Martinez", channel: "Online Webstore", items: 2, total: 149.99, status: "completed", paymentMethod: "Credit Card (Stripe)", tax: 12.0 },
  { id: "ORD-9419", date: "2026-10-14 16:32", customer: "Liam Chen", channel: "Amazon", items: 1, total: 89.5, status: "completed", paymentMethod: "Amazon Pay", tax: 7.16 },
  { id: "ORD-9418", date: "2026-10-14 15:10", customer: "Marcus Brody", channel: "Online Webstore", items: 3, total: 210.0, status: "refunded", paymentMethod: "PayPal", tax: 16.8, reason: "Customer return within 14 days" },
  { id: "ORD-9417", date: "2026-10-14 14:45", customer: "Emma Watson", channel: "Showroom POS", items: 4, total: 320.0, status: "completed", paymentMethod: "Contactless Card", tax: 25.6 },
  { id: "ORD-9416", date: "2026-10-14 13:20", customer: "TechCraft Studio", channel: "Wholesale B2B", items: 20, total: 3890.0, status: "completed", paymentMethod: "ACH Wire Transfer", tax: 311.2 },
  { id: "ORD-9415", date: "2026-10-14 11:50", customer: "Oliver Twist", channel: "Online Webstore", items: 1, total: 49.99, status: "completed", paymentMethod: "Apple Pay", tax: 4.0 },
  { id: "ORD-9414", date: "2026-10-14 10:15", customer: "Elena Rostova", channel: "Amazon", items: 2, total: 120.0, status: "completed", paymentMethod: "Amazon Pay", tax: 9.6 },
];

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<"ledger" | "drilldown" | "channels">("ledger");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const { showToast } = useToast();

  // Filter transactions based on drawer filters
  const filteredTransactions = TRANSACTIONS_DATA.filter((tx) => {
    if (channelFilter !== "all" && !tx.channel.toLowerCase().includes(channelFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && tx.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const columns: Column<any>[] = [
    {
      key: "id",
      header: "Order ID",
      render: (row) => (
        <span className="font-mono font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
          {row.id}
        </span>
      ),
    },
    { key: "date", header: "Date" },
    {
      key: "customer",
      header: "Customer",
      render: (row) => <span className="font-semibold text-slate-800">{row.customer}</span>,
    },
    { key: "channel", header: "Channel" },
    { key: "items", header: "Items", align: "center" },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.total)}</span>,
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
      title="Sales Analytics"
      subtitle="Multi-level revenue trends, transactional ledger, and channel performance"
    >
      <PageHeader
        title="Sales Analytics"
        subtitle="Detailed revenue performance, channel attribution, and order transaction ledger"
        actions={
          <div className="flex items-center gap-2">
            <DateRangeSelect value={selectedPeriod} onChange={setSelectedPeriod} />
            <button
              onClick={() => setFiltersDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <SlidersHorizontal size={14} className="text-slate-500" />
              <span>Filters</span>
              {(channelFilter !== "all" || statusFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => showToast("Transactions ledger exported to CSV successfully!")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-2xs"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        }
      />

      {/* Top 3 Sales KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Sales Orders"
          value="725"
          previousValue="670"
          growthPct={8.21}
          icon={ShoppingBag}
          formula="Count of non-cancelled sales orders"
        />
        <KpiCard
          title="Net Sales Revenue"
          value="$67,450.00"
          previousValue="$61,800.00"
          growthPct={9.14}
          icon={DollarSign}
          formula="Valid orders after documented refunds and discounts"
        />
        <KpiCard
          title="Average Order Value (AOV)"
          value="$93.03"
          previousValue="$92.24"
          growthPct={0.86}
          icon={TrendingUp}
          formula="Eligible Net Revenue / Eligible Orders"
        />
      </div>

      {/* Primary Revenue Trend Chart */}
      <ChartCard
        title="Revenue & Profit Trajectory"
        subtitle="Quarterly historical trend comparison with cost snapshots"
        heightClass="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={QUARTERLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartTheme.gridProps} />
            <XAxis dataKey="period" {...chartTheme.xAxisProps} />
            <YAxis {...chartTheme.yAxisProps} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={chartTheme.tooltipStyle}
              formatter={(val: any) => [formatCurrency(val), ""]}
            />
            <Area
              type="monotone"
              name="Net Revenue"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Navigation Tabs for Progressive Disclosure */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px ${
            activeTab === "ledger"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Transactions Ledger
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px ${
            activeTab === "channels"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Channel Attribution
        </button>
        <button
          onClick={() => setActiveTab("drilldown")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px ${
            activeTab === "drilldown"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Quarterly Breakdown
        </button>
      </div>

      {/* Tab 1: Transactions Table with Row-Click Drawer */}
      {activeTab === "ledger" && (
        <DataTable
          title="Recent Order Transactions"
          data={filteredTransactions}
          columns={columns}
          searchPlaceholder="Search order ID, customer name..."
          searchKey="customer"
          onRowClick={(order) => setSelectedOrder(order)}
          pageSize={7}
        />
      )}

      {/* Tab 2: Channel Breakdown */}
      {activeTab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SALES_CHANNEL_DATA.map((ch) => (
            <div
              key={ch.channel}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{ch.channel}</h4>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {ch.share}% Share
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Revenue</span>
                    <span className="text-base font-bold text-slate-900">{formatCurrency(ch.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Orders</span>
                    <span className="text-base font-bold text-slate-900">{formatNumber(ch.orders)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Quarterly Breakdown */}
      {activeTab === "drilldown" && (
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-2.5">Quarter</th>
                <th className="py-2.5 text-right">Revenue</th>
                <th className="py-2.5 text-right">Gross Profit</th>
                <th className="py-2.5 text-right">Orders</th>
                <th className="py-2.5 text-right">AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {QUARTERLY_DATA.map((q) => (
                <tr key={q.period} className="hover:bg-slate-50">
                  <td className="py-2.5 font-bold text-slate-900">{q.period}</td>
                  <td className="py-2.5 text-right font-semibold text-slate-800">{formatCurrency(q.revenue)}</td>
                  <td className="py-2.5 text-right text-emerald-600 font-semibold">{formatCurrency(q.profit)}</td>
                  <td className="py-2.5 text-right text-slate-700">{formatNumber(q.orders)}</td>
                  <td className="py-2.5 text-right font-mono text-slate-900">{formatCurrency(q.aov)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Progressive Disclosure: Order Detail Drawer */}
      <SideDrawer
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Transaction: ${selectedOrder.id}` : "Transaction"}
        subtitle="Complete order ledger & line-item verification"
        footer={
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Close Details
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
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-medium text-slate-700">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              {selectedOrder.reason && (
                <div className="p-2 rounded bg-rose-50 text-rose-700 text-[11px] border border-rose-100">
                  <strong>Return Reason:</strong> {selectedOrder.reason}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Items Count:</span>
                <span className="font-semibold text-slate-800">{selectedOrder.items} items</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax Captured:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-900">Total Net Paid:</span>
                <span className="text-indigo-600">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </SideDrawer>

      {/* Advanced Filters Drawer */}
      <SideDrawer
        isOpen={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        title="Filter Sales Transactions"
        subtitle="Narrow down ledger by channel, status, and thresholds"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => {
                setChannelFilter("all");
                setStatusFilter("all");
                setFiltersDrawerOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Reset
            </button>
            <button
              onClick={() => setFiltersDrawerOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Sales Channel</label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
            >
              <option value="all">All Channels</option>
              <option value="webstore">Online Webstore (Shopify)</option>
              <option value="amazon">Amazon Marketplace</option>
              <option value="wholesale">Wholesale B2B</option>
              <option value="pos">Direct Showroom POS</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="refunded">Refunded Only</option>
            </select>
          </div>
        </div>
      </SideDrawer>
    </AppLayout>
  );
}
