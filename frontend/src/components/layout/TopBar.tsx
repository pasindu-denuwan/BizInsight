"use client";

import React, { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  Database,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

const SAMPLE_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Stockout hazard on Wireless ANC Headphones",
    time: "10m ago",
    type: "critical",
    message: "Stock has fallen below reorder threshold (14 units vs 48 ROP).",
  },
  {
    id: "notif-2",
    title: "Quarterly ledger reconciled successfully",
    time: "2h ago",
    type: "success",
    message: "1,842 transactions verified with 0 discrepancy in MySQL 8.",
  },
  {
    id: "notif-3",
    title: "New Customer Segment Surge",
    time: "5h ago",
    type: "info",
    message: "Potential Loyalists cohort grew by 24% following the promotional event.",
  },
];

export function TopBar({
  title,
  subtitle,
  onOpenMobileMenu,
  actions,
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle & page context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>

          {title && (
            <div className="flex flex-col truncate">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 hidden md:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search metrics, orders, SKUs (Ctrl+K)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications, Database & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {actions}

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="View system alerts"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* MySQL status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-lg border border-slate-200">
            <Database size={13} className="text-indigo-600" />
            <span>MySQL 8.0</span>
          </div>

          {/* User Profile Link */}
          <Link
            href="/settings"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition-colors group"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs">
              JD
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden lg:inline">
              Jane Doe
            </span>
          </Link>
        </div>
      </header>

      {/* Notifications Side Drawer */}
      <SideDrawer
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="System Alerts & Notifications"
        subtitle="Real-time operational alerts from analytics and reconciliation ledger"
        footer={
          <button
            onClick={() => setNotifOpen(false)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        }
      >
        <div className="space-y-3">
          {SAMPLE_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">{n.title}</span>
                <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">{n.message}</p>
              <StatusBadge status={n.type} />
            </div>
          ))}
        </div>
      </SideDrawer>
    </>
  );
}
