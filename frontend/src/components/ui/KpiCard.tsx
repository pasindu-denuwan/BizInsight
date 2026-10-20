"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, Info, LucideIcon } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  previousValue?: string;
  growthPct?: number | null;
  icon?: LucideIcon;
  formula?: string;
  isEstimate?: boolean;
  invertColor?: boolean; // When true (e.g. expenses, refunds), an increase is considered negative/red
  className?: string;
  onClick?: () => void;
}

export function KpiCard({
  title,
  value,
  previousValue,
  growthPct,
  icon: Icon,
  formula,
  isEstimate = false,
  invertColor = false,
  className,
  onClick,
}: KpiCardProps) {
  const isPositive = growthPct !== undefined && growthPct !== null && growthPct > 0;
  const isNegative = growthPct !== undefined && growthPct !== null && growthPct < 0;
  const isNeutral = growthPct === undefined || growthPct === null || growthPct === 0;

  // With invertColor, positive is danger (e.g., expenses rising), negative is good
  const isGood = invertColor ? isNegative : isPositive;
  const isBad = invertColor ? isPositive : isNegative;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between select-none",
        onClick && "cursor-pointer hover:border-indigo-300",
        className
      )}
    >
      {/* Top Header: Title, Icon, Formula Tooltip */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 truncate">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Icon size={16} />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5 truncate">
            {title}
            {isEstimate && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                EST
              </span>
            )}
          </span>
        </div>

        {formula && (
          <div className="relative group/tooltip">
            <Info size={14} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:block w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 pointer-events-none">
              <span className="font-semibold block text-slate-300 mb-0.5">Calculation:</span>
              {formula}
            </div>
          </div>
        )}
      </div>

      {/* Primary Value */}
      <div className="mt-1">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
      </div>

      {/* Trend & Comparison */}
      {(growthPct !== undefined || previousValue) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-1.5">
            {growthPct !== undefined && growthPct !== null ? (
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold gap-0.5",
                  isGood && "bg-emerald-50 text-emerald-700",
                  isBad && "bg-rose-50 text-rose-700",
                  isNeutral && "bg-slate-100 text-slate-600"
                )}
              >
                {isPositive && <ArrowUpRight size={13} />}
                {isNegative && <ArrowDownRight size={13} />}
                {isNeutral && <Minus size={13} />}
                {formatPercent(growthPct)}
              </span>
            ) : (
              <span className="text-slate-400 font-medium">--</span>
            )}
            <span className="text-slate-400 text-[10px]">vs prior period</span>
          </div>

          {previousValue && (
            <span className="text-slate-400 text-[10px] font-medium truncate">
              Prev: {previousValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
