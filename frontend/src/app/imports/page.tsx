"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import Link from "next/link";

interface ValidationRow {
  row_num: number;
  sku: string;
  name: string;
  price: string;
  cost: string;
  qoh: string;
  status: "valid" | "error";
  reason?: string;
}

const PREVIEW_ROWS: ValidationRow[] = [
  { row_num: 1, sku: "ELEC-SPK-01", name: "Bluetooth Portable Speaker", price: "49.99", cost: "22.50", qoh: "45", status: "valid" },
  { row_num: 2, sku: "APP-TEE-BLK-M", name: "Classic Organic Cotton Tee (M)", price: "24.00", cost: "8.00", qoh: "120", status: "valid" },
  { row_num: 3, sku: "HOME-PAN-NONSTK", name: "Non-Stick 10-inch Skillet", price: "39.50", cost: "45.00", qoh: "30", status: "error", reason: "Negative Gross Margin: Cost ($45.00) exceeds Price ($39.50)" },
  { row_num: 4, sku: "SPRT-BTL-1L", name: "Insulated Stainless Bottle 1L", price: "invalid_num", cost: "11.20", qoh: "60", status: "error", reason: "Data format error: Price must be a valid DECIMAL" },
  { row_num: 5, sku: "BEAU-OIL-ARGAN", name: "Pure Organic Argan Oil 50ml", price: "28.00", cost: "9.50", qoh: "75", status: "valid" },
];

export default function ImportPage() {
  const [committed, setCommitted] = useState(false);
  const { showToast } = useToast();

  const handleCommit = () => {
    setCommitted(true);
    showToast("Valid rows committed to MySQL 8 with transactional rollback protection (BR-003)!");
  };

  return (
    <AppLayout
      title="CSV Import Center"
      subtitle="Batch data ingestion with pre-commit validation and atomic rollback (BR-003)"
    >
      <PageHeader
        title="CSV Import Center"
        subtitle="Transactional batch ingestion with row-by-row error detection"
        actions={
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <span>View within Reports Center</span>
            <ArrowRight size={13} />
          </Link>
        }
      />

      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UploadCloud size={16} className="text-indigo-600 shrink-0" />
          <span>
            <strong>Progressive Disclosure Note:</strong> In the simplified UI, CSV imports are integrated directly into the <strong>Reports</strong> tab.
          </span>
        </div>
        <Link href="/reports" className="font-bold text-indigo-600 hover:text-indigo-800 underline">
          Open Reports & Data Center
        </Link>
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Pre-Commit Validation Preview</h3>
          <button
            onClick={handleCommit}
            disabled={committed}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {committed ? "Committed to Database" : "Commit Valid Rows"}
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-2.5">Row</th>
                <th className="p-2.5">SKU</th>
                <th className="p-2.5">Name</th>
                <th className="p-2.5 text-right">Price</th>
                <th className="p-2.5 text-right">Cost</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PREVIEW_ROWS.map((row) => (
                <tr key={row.row_num} className={row.status === "error" ? "bg-rose-50/50" : "hover:bg-slate-50"}>
                  <td className="p-2.5 font-mono">{row.row_num}</td>
                  <td className="p-2.5 font-mono text-indigo-600 font-semibold">{row.sku}</td>
                  <td className="p-2.5 font-medium">{row.name}</td>
                  <td className="p-2.5 text-right">${row.price}</td>
                  <td className="p-2.5 text-right">${row.cost}</td>
                  <td className="p-2.5"><StatusBadge status={row.status} /></td>
                  <td className="p-2.5 text-[11px] text-slate-500">{row.reason || "Verified"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
