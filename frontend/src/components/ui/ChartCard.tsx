import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./FeedbackStates";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
  heightClass?: string;
}

export function ChartCard({
  title,
  subtitle,
  badge,
  actions,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available for the selected period",
  children,
  className,
  heightClass = "h-72",
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      <div className={cn("w-full relative", heightClass)}>
        {isLoading ? (
          <div className="w-full h-full flex flex-col justify-center space-y-3 p-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : isEmpty ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
