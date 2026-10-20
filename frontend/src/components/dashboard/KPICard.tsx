"use client";

import { ArrowUpRight, ArrowDownRight, Minus, Info } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  previousValue: string;
  growthPct: number | null;
  formula?: string;
  isEstimate?: boolean;
  invertColor?: boolean; // e.g. for refund or expenses where increase is bad
}

export function KPICard({
  title,
  value,
  previousValue,
  growthPct,
  formula,
  isEstimate = false,
  invertColor = false,
}: KPICardProps) {
  const isPositive = growthPct !== null && growthPct > 0;
  const isNegative = growthPct !== null && growthPct < 0;
  const isNeutral = growthPct === null || growthPct === 0;

  // If invertColor is true, positive growth is danger (e.g. expenses up)
  const isGood = invertColor ? isNegative : isPositive;
  const isBad = invertColor ? isPositive : isNegative;

  return (
    <div className="group relative p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Header with Title and info tooltip */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1 truncate">
          {title}
          {isEstimate && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
              EST
            </span>
          )}
        </span>
        {formula && (
          <div className="relative group/tooltip">
            <Info size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 pointer-events-none">
              <span className="font-semibold block text-slate-300 mb-0.5">Calculation:</span>
              {formula}
            </div>
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>

      {/* Period Comparison Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
        <div className="flex items-center gap-1 font-medium">
          {growthPct !== null ? (
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
            <span className="text-slate-400">N/A</span>
          )}
          <span className="text-slate-400 text-[10px]">vs prior period</span>
        </div>
        <span className="text-slate-400 text-[10px] truncate">Prev: {previousValue}</span>
      </div>
    </div>
  );
}
