import React from "react";
import { Lightbulb, ArrowRight, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

export interface Insight {
  id: string;
  title: string;
  category?: string;
  severity: "critical" | "warning" | "success" | "info";
  observation: string;
  suggested_action: string;
  rule_id?: string;
  data_confidence?: string;
  status?: "active" | "reviewed" | "dismissed";
}

interface InsightCardProps {
  insight: Insight;
  onReview?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function InsightCard({
  insight,
  onReview,
  onDismiss,
  className,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3",
        className
      )}
    >
      <div>
        {/* Header: Title and Severity Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#BBFBFF]/50 text-[#5409DA] border border-[#8DD8FF]/40 shrink-0">
              <Lightbulb size={16} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug">
              {insight.title}
            </h4>
          </div>
          <StatusBadge status={insight.severity} />
        </div>

        {/* Observation text */}
        <p className="text-xs text-slate-600 leading-relaxed pl-8">
          <strong className="text-slate-700 font-semibold">Observation: </strong>
          {insight.observation}
        </p>

        {/* Action Callout Box */}
        <div className="mt-2.5 ml-8 p-2.5 rounded-lg bg-[#BBFBFF]/30 border border-[#8DD8FF]/50 text-xs text-slate-800 flex items-start gap-2">
          <span className="font-bold text-[#5409DA] shrink-0">Action:</span>
          <span className="leading-relaxed">{insight.suggested_action}</span>
        </div>
      </div>

      {/* Footer Actions (Review / Dismiss) */}
      {(onReview || onDismiss) && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
          {onDismiss && (
            <button
              onClick={() => onDismiss(insight.id)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Dismiss
            </button>
          )}
          {onReview && (
            <button
              onClick={() => onReview(insight.id)}
              className="px-3 py-1 text-[11px] font-semibold text-white bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] rounded-md shadow-xs shadow-[#5409DA]/25 transition-all flex items-center gap-1"
            >
              <CheckCircle2 size={12} />
              Review & Execute
            </button>
          )}
        </div>
      )}
    </div>
  );
}
