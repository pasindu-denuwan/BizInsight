"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const DATE_RANGES = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "This Quarter",
  "Year to Date",
  "Last 12 Months",
] as const;

export type DateRange = (typeof DATE_RANGES)[number];

interface DateRangeSelectProps {
  value?: string;
  onChange?: (range: string) => void;
  className?: string;
}

export function DateRangeSelect({
  value = "Last 30 Days",
  onChange,
  className,
}: DateRangeSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const handleSelect = (range: string) => {
    setSelected(range);
    setOpen(false);
    onChange?.(range);
  };

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all select-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Calendar size={14} className="text-indigo-600" />
        <span>{selected}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 py-1 z-50 animate-fade-in divide-y divide-slate-100">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Filter Date Range
            </div>
            <div className="py-1">
              {DATE_RANGES.map((range) => {
                const isSelected = selected === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => handleSelect(range)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors",
                      isSelected
                        ? "text-indigo-600 font-semibold bg-indigo-50/60"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{range}</span>
                    {isSelected && <Check size={14} className="text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
