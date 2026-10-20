"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Boxes,
  Lightbulb,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Exactly 6 main navigation items as specified in the simplified UI plan
export const MAIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Sales", href: "/sales", icon: TrendingUp },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Reports", href: "/reports", icon: FileSpreadsheet },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Load and persist collapsed state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bizinsight_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("bizinsight_sidebar_collapsed", String(next));
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0e0821] text-white transition-all duration-300 border-r border-[#1e133d] shrink-0 select-none",
          // Desktop positioning
          "lg:static lg:translate-x-0",
          // Mobile responsive slide-in
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Collapsed width vs expanded width
          collapsed ? "lg:w-20 w-64" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e133d]">
          <Link
            href="/"
            className="flex items-center gap-3 overflow-hidden group"
            onClick={onMobileClose}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5409DA] via-[#4E71FF] to-[#8DD8FF] flex items-center justify-center font-bold text-white shadow-md shadow-[#5409DA]/35 text-lg shrink-0 group-hover:scale-105 transition-transform ring-1 ring-[#BBFBFF]/30">
              B
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  BizInsight
                  <span className="text-[10px] font-semibold bg-[#5409DA]/30 text-[#BBFBFF] px-1.5 py-0.5 rounded border border-[#8DD8FF]/40">
                    CORE
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">Decision Support</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-[#BBFBFF] hover:bg-[#1a113d] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="flex lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a113d] transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace Indicator */}
        <div className="p-3 border-b border-[#1e133d]">
          <div className="p-2 rounded-xl bg-[#150d30] border border-[#261754] flex items-center gap-2.5">
            <Building2 size={16} className="text-[#8DD8FF] shrink-0 ml-1" />
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col truncate flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8DD8FF]/80">
                  Workspace
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate">
                  Acme Retail Corp
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Exactly 6 Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed && !mobileOpen ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white font-semibold shadow-md shadow-[#5409DA]/35 border-l-2 border-[#BBFBFF]"
                    : "text-slate-400 hover:text-white hover:bg-[#191038]/80"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-[#BBFBFF]" : "text-slate-400 group-hover:text-[#8DD8FF]"
                  )}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Pinned Bottom: Settings & Profile */}
        <div className="p-3 border-t border-[#1e133d] space-y-2">
          {/* Settings link */}
          <Link
            href="/settings"
            onClick={onMobileClose}
            title={collapsed && !mobileOpen ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150",
              pathname.startsWith("/settings")
                ? "bg-[#1d1240] text-white font-semibold border-l-2 border-[#8DD8FF]"
                : "text-slate-400 hover:text-white hover:bg-[#191038]/80"
            )}
          >
            <Settings size={18} className="shrink-0" />
            {(!collapsed || mobileOpen) && <span className="truncate">Settings</span>}
          </Link>

          {/* Profile Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#150d30] border border-[#261754]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5409DA] to-[#4E71FF] border border-[#8DD8FF]/40 flex items-center justify-center text-xs font-bold text-[#BBFBFF] shrink-0 shadow-xs shadow-[#5409DA]/30">
              JD
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col truncate flex-1">
                <span className="text-xs font-semibold text-white truncate">Jane Doe</span>
                <span className="text-[10px] text-[#BBFBFF] font-medium">Owner / Admin</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
