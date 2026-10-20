"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Users,
  Award,
  Sparkles,
  Download,
  Info,
  Calendar,
  ShoppingBag,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const RFM_SEGMENTS = [
  {
    name: "Champions",
    description: "Bought recently, buy often, and spend the most.",
    count: 38,
    pct: 22,
    revenue: 94500,
    aov: 164.2,
    action: "Reward with exclusive VIP early access; do not discount heavily.",
    badgeVariant: "success" as const,
  },
  {
    name: "Loyal Customers",
    description: "Consistent purchase history, responsive to promotions.",
    count: 45,
    pct: 26,
    revenue: 68200,
    aov: 112.5,
    action: "Upsell premium tiers; ask for reviews and referral recommendations.",
    badgeVariant: "info" as const,
  },
  {
    name: "Potential Loyalists",
    description: "Recent buyers with average frequency, promising trajectory.",
    count: 42,
    pct: 24,
    revenue: 38900,
    aov: 92.6,
    action: "Offer membership program and targeted cross-sell bundles.",
    badgeVariant: "info" as const,
  },
  {
    name: "New Customers",
    description: "Bought most recently, but frequency score is low.",
    count: 24,
    pct: 14,
    revenue: 19400,
    aov: 80.8,
    action: "Onboard with welcome email sequence, offer second-purchase discount.",
    badgeVariant: "neutral" as const,
  },
  {
    name: "At-Risk Customers",
    description: "Spent big money and purchased often, but long time ago.",
    count: 15,
    pct: 9,
    revenue: 16800,
    aov: 140.0,
    action: "Send personalized win-back reactivation campaign with incentives.",
    badgeVariant: "warning" as const,
  },
  {
    name: "Hibernating",
    description: "Last purchase was long ago, low spenders, low frequency.",
    count: 8,
    pct: 5,
    revenue: 4200,
    aov: 52.5,
    action: "Offer relevant standard discount; avoid spending heavy marketing budget.",
    badgeVariant: "danger" as const,
  },
];

const CUSTOMERS_LIST = [
  { id: "CUST-1042", name: "Apex Global Tech", email: "procurement@apextech.com", segment: "Champions", orders: 34, totalSpend: 14250.0, ltvEst: 28500.0, recency: "2 days ago", rScore: 5, fScore: 5, mScore: 5 },
  { id: "CUST-1089", name: "Samantha Miller", email: "samantha.m@gmail.com", segment: "Champions", orders: 28, totalSpend: 8940.0, ltvEst: 16200.0, recency: "5 days ago", rScore: 5, fScore: 5, mScore: 4 },
  { id: "CUST-1015", name: "Delta Distribution Corp", email: "accounts@deltadist.com", segment: "Loyal Customers", orders: 22, totalSpend: 7850.0, ltvEst: 14100.0, recency: "12 days ago", rScore: 4, fScore: 4, mScore: 4 },
  { id: "CUST-1104", name: "Benjamin Wright", email: "b.wright@outlook.com", segment: "Potential Loyalists", orders: 12, totalSpend: 3450.0, ltvEst: 6900.0, recency: "8 days ago", rScore: 4, fScore: 3, mScore: 3 },
  { id: "CUST-1002", name: "Vanguard Studios", email: "billing@vanguardstudios.io", segment: "At-Risk Customers", orders: 19, totalSpend: 6200.0, ltvEst: 8000.0, recency: "114 days ago", rScore: 1, fScore: 4, mScore: 4 },
  { id: "CUST-1145", name: "Chloe Bennett", email: "chloe.b@icloud.com", segment: "New Customers", orders: 2, totalSpend: 310.0, ltvEst: 2400.0, recency: "3 days ago", rScore: 5, fScore: 1, mScore: 1 },
  { id: "CUST-1077", name: "Modern Living Design", email: "orders@modernliving.com", segment: "Loyal Customers", orders: 18, totalSpend: 5400.0, ltvEst: 11000.0, recency: "16 days ago", rScore: 4, fScore: 4, mScore: 3 },
  { id: "CUST-1033", name: "David K. Ross", email: "davidross@protonmail.com", segment: "Hibernating", orders: 3, totalSpend: 420.0, ltvEst: 600.0, recency: "210 days ago", rScore: 1, fScore: 1, mScore: 1 },
];

export default function CustomersPage() {
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const { showToast } = useToast();

  const filteredCustomers = CUSTOMERS_LIST.filter((cust) => {
    if (selectedSegment === "all") return true;
    return cust.segment.toLowerCase() === selectedSegment.toLowerCase();
  });

  const columns: Column<any>[] = [
    {
      key: "id",
      header: "Customer ID",
      render: (row) => (
        <span className="font-mono font-medium text-[#5409DA] bg-[#BBFBFF]/50 border border-[#8DD8FF]/40 px-1.5 py-0.5 rounded text-[11px]">
          {row.id}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div>
          <span className="font-bold text-slate-800 block">{row.name}</span>
          <span className="text-[11px] text-slate-400">{row.email}</span>
        </div>
      ),
    },
    {
      key: "segment",
      header: "RFM Segment",
      render: (row) => <StatusBadge status={row.segment} />,
    },
    { key: "orders", header: "Orders", align: "center" },
    {
      key: "totalSpend",
      header: "Total Spend",
      align: "right",
      render: (row) => (
        <span className="font-bold text-slate-900">{formatCurrency(row.totalSpend)}</span>
      ),
    },
    {
      key: "ltvEst",
      header: "LTV (Est.)",
      align: "right",
      render: (row) => (
        <span className="font-semibold text-[#5409DA]">{formatCurrency(row.ltvEst)}</span>
      ),
    },
    {
      key: "recency",
      header: "Last Order",
      className: "text-slate-500",
    },
  ];

  return (
    <AppLayout
      title="Customer Analytics & RFM"
      subtitle="Recency, Frequency, and Monetary cohort analysis with honest LTV estimates"
    >
      <PageHeader
        title="Customer Intelligence"
        subtitle="172 total active customers classified into 6 actionable RFM quintiles"
        actions={
          <button
            onClick={() => showToast("Customer profiles and RFM segment matrix exported!")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
          >
            <Download size={14} />
            <span>Export Segments</span>
          </button>
        }
      />

      {/* KPI Cards: Total, New, Average LTV */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Customers"
          value="172"
          previousValue="154"
          growthPct={11.69}
          icon={Users}
          formula="Count of distinct customer profiles with ≥1 order"
        />
        <KpiCard
          title="New Cohort Customers"
          value="24"
          previousValue="18"
          growthPct={33.33}
          icon={Sparkles}
          formula="Customers whose first purchase fell within selected period"
        />
        <KpiCard
          title="Estimated Average LTV"
          value="$12,450.00"
          previousValue="$11,800.00"
          growthPct={5.51}
          isEstimate={true}
          icon={Award}
          formula="AOV × Purchase Frequency × Estimated Retention Lifetime"
        />
      </div>

      {/* Segments Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">RFM Segments</h3>
          <span className="text-xs text-slate-400">Click a segment to filter customer table</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setSelectedSegment("all")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedSegment === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="text-[11px] font-semibold block text-slate-400">All Customers</span>
            <span className="text-lg font-bold">172</span>
          </button>

          {RFM_SEGMENTS.map((seg) => {
            const isSelected = selectedSegment.toLowerCase() === seg.name.toLowerCase();
            return (
              <button
                key={seg.name}
                onClick={() => setSelectedSegment(seg.name)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-gradient-to-br from-[#5409DA] to-[#4E71FF] text-white border-[#5409DA] shadow-md shadow-[#5409DA]/25"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-[#BBFBFF]" : "text-slate-400"}`}>
                    {seg.pct}%
                  </span>
                </div>
                <span className="text-base font-bold block">{seg.count}</span>
                <span className={`text-[11px] font-semibold truncate block ${isSelected ? "text-white" : "text-slate-700"}`}>
                  {seg.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer DataTable with Row-Click Profile Drawer */}
      <DataTable
        title="Customer Profiles"
        data={filteredCustomers}
        columns={columns}
        searchPlaceholder="Search customer by name or email..."
        searchKey="name"
        onRowClick={(customer) => setSelectedCustomer(customer)}
        pageSize={6}
      />

      {/* Customer Profile SideDrawer */}
      <SideDrawer
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? selectedCustomer.name : "Customer Profile"}
        subtitle={selectedCustomer ? `${selectedCustomer.id} • ${selectedCustomer.email}` : ""}
        footer={
          <button
            onClick={() => setSelectedCustomer(null)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
          >
            Done
          </button>
        }
      >
        {selectedCustomer && (
          <div className="space-y-5 text-xs">
            {/* Segment status banner */}
            <div className="p-4 rounded-xl bg-[#BBFBFF]/30 border border-[#8DD8FF]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5409DA] tracking-wider block">
                  Assigned Segment
                </span>
                <span className="text-sm font-bold text-slate-900">{selectedCustomer.segment}</span>
              </div>
              <StatusBadge status={selectedCustomer.segment} />
            </div>

            {/* RFM Score Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                RFM Quintile Scores (1 to 5)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Recency (R)</span>
                  <span className="text-lg font-bold text-[#5409DA]">{selectedCustomer.rScore}/5</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Frequency (F)</span>
                  <span className="text-lg font-bold text-[#5409DA]">{selectedCustomer.fScore}/5</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Monetary (M)</span>
                  <span className="text-lg font-bold text-[#5409DA]">{selectedCustomer.mScore}/5</span>
                </div>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Lifetime Completed Orders:</span>
                <span className="font-bold text-slate-900">{selectedCustomer.orders} orders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Total Spend:</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedCustomer.totalSpend)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated LTV:</span>
                <span className="font-bold text-[#5409DA]">{formatCurrency(selectedCustomer.ltvEst)} (Est.)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Purchase Recency:</span>
                <span className="text-slate-700 font-medium">{selectedCustomer.recency}</span>
              </div>
            </div>

            {/* Retention Heuristic Action */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900">
              <strong className="block text-xs font-bold mb-1">Recommended Engagement Action:</strong>
              <p className="text-[11px] leading-relaxed">
                {RFM_SEGMENTS.find((s) => s.name === selectedCustomer.segment)?.action ||
                  "Engage with standard personalized catalog updates."}
              </p>
            </div>
          </div>
        )}
      </SideDrawer>
    </AppLayout>
  );
}
