import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({
  status,
  variant = "neutral",
  className,
  dot = true,
}: StatusBadgeProps) {
  // Automatically infer variant if not strictly specified
  let resolvedVariant = variant;
  const s = status.toLowerCase();
  if (s.includes("complete") || s.includes("paid") || s.includes("active") || s.includes("healthy") || s.includes("valid") || s.includes("champion")) {
    resolvedVariant = "success";
  } else if (s.includes("warning") || s.includes("at-risk") || s.includes("pending") || s.includes("medium")) {
    resolvedVariant = "warning";
  } else if (s.includes("critical") || s.includes("danger") || s.includes("error") || s.includes("refunded") || s.includes("hibernating") || s.includes("out of stock")) {
    resolvedVariant = "danger";
  } else if (s.includes("info") || s.includes("new") || s.includes("loyal")) {
    resolvedVariant = "info";
  }

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    success: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    warning: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    danger: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    neutral: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
    info: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
  };

  const style = variantStyles[resolvedVariant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize tracking-wide select-none",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />}
      <span>{status}</span>
    </span>
  );
}
