"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DateRangeSelect } from "@/components/ui/DateRangeSelect";
import { EmptyState, Skeleton, ErrorState } from "@/components/ui/FeedbackStates";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import {
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function StyleGuidePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <AppLayout
      title="Design System & Style Guide"
      subtitle="Phase 1 Single Source of Truth: design tokens, base components, and type scale"
    >
      <PageHeader
        title="Visual Foundation"
        subtitle="Central token definitions and UI building blocks for BizInsight"
        actions={
          <button
            onClick={() => {
              showToast("Toast feedback triggered successfully!");
              setDrawerOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-indigo-600 rounded-lg shadow-sm transition-all"
          >
            Test Drawer & Toast
          </button>
        }
      />

      {/* Color Palette Tokens */}
      <section className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Design Token Colors
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { name: "Primary", hex: "#4F46E5", bg: "bg-[#4F46E5]", text: "text-white" },
            { name: "Sidebar", hex: "#111827", bg: "bg-[#111827]", text: "text-white" },
            { name: "Background", hex: "#F8FAFC", bg: "bg-[#F8FAFC]", text: "text-slate-900 border" },
            { name: "Card Surface", hex: "#FFFFFF", bg: "bg-[#FFFFFF]", text: "text-slate-900 border" },
            { name: "Text", hex: "#1F2937", bg: "bg-[#1F2937]", text: "text-white" },
            { name: "Muted", hex: "#6B7280", bg: "bg-[#6B7280]", text: "text-white" },
            { name: "Success", hex: "#16A34A", bg: "bg-[#16A34A]", text: "text-white" },
            { name: "Danger", hex: "#DC2626", bg: "bg-[#DC2626]", text: "text-white" },
          ].map((c) => (
            <div key={c.name} className="flex flex-col gap-1.5">
              <div
                className={`h-14 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${c.bg} ${c.text}`}
              >
                {c.hex}
              </div>
              <span className="text-xs font-semibold text-slate-700">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons & Badges */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Button Hierarchy
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <button className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs transition-colors">
              Primary Button
            </button>
            <button className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors">
              Secondary Button
            </button>
            <button className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              Ghost Button
            </button>
            <button className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors">
              Danger Button
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Status Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="Completed" variant="success" />
            <StatusBadge status="Pending Review" variant="warning" />
            <StatusBadge status="Stockout Risk" variant="danger" />
            <StatusBadge status="New Cohort" variant="info" />
            <StatusBadge status="Archived" variant="neutral" />
          </div>
        </div>
      </section>

      {/* KPI Card Demo */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Standardized KPI Card Sample
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Revenue"
            value="$67,450.00"
            previousValue="$61,800.00"
            growthPct={9.1}
            icon={DollarSign}
            formula="Gross Sales − Discounts − Refunds"
          />
          <KpiCard
            title="Operating Expenses"
            value="$12,800.00"
            previousValue="$12,300.00"
            growthPct={4.1}
            invertColor={true}
            icon={TrendingUp}
            formula="Sum of logged OPEX"
          />
          <KpiCard
            title="Net Profit"
            value="$18,450.00"
            previousValue="$16,100.00"
            growthPct={14.6}
            isEstimate={true}
            icon={Sparkles}
            formula="Gross Profit − Operating Expenses"
          />
          <KpiCard
            title="Total Sales"
            value="725 orders"
            previousValue="670"
            growthPct={8.2}
            icon={Package}
            formula="Count of non-cancelled orders"
          />
        </div>
      </section>

      {/* Detail SideDrawer preview */}
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Sample SideDrawer"
        subtitle="Used for progressive disclosure and detail inspection"
        footer={
          <button
            onClick={() => setDrawerOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Close Drawer
          </button>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          This slide-over SideDrawer replaces intrusive modal popups across the application.
          Used for viewing transaction detail lines, editing product stock thresholds, and customer profiles.
        </p>
      </SideDrawer>
    </AppLayout>
  );
}
