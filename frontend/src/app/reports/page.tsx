"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DateRangeSelect } from "@/components/ui/DateRangeSelect";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";

const SAVED_REPORTS = [
  {
    id: "REP-01",
    title: "Executive Monthly Financial Brief",
    schedule: "Monthly (1st at 00:00 UTC)",
    format: "CSV + Spreadsheet",
    lastRun: "2026-10-01 00:00",
    size: "142 KB",
    type: "Financial",
  },
  {
    id: "REP-02",
    title: "Reconciled Sales Transactions & Tax Ledger",
    schedule: "Weekly on Monday",
    format: "CSV",
    lastRun: "2026-10-12 00:00",
    size: "820 KB",
    type: "Sales",
  },
  {
    id: "REP-03",
    title: "Customer RFM Quintile & LTV Distribution",
    schedule: "Daily Refresh",
    format: "CSV",
    lastRun: "2026-10-14 00:00",
    size: "68 KB",
    type: "Customers",
  },
  {
    id: "REP-04",
    title: "Inventory Movements Audit & Turnover Reorder Schedule",
    schedule: "Daily Refresh",
    format: "CSV + Print Layout",
    lastRun: "2026-10-14 00:00",
    size: "215 KB",
    type: "Inventory",
  },
];

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

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "import">("reports");
  const [selectedReportType, setSelectedReportType] = useState("all-financial");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [importStep, setImportStep] = useState<1 | 2 | 3>(1);
  const [committed, setCommitted] = useState(false);
  const { showToast } = useToast();

  const handleGenerateReport = () => {
    showToast(`Generated "${selectedReportType}" report statement for ${dateRange}!`);
  };

  const handleCommitImport = () => {
    setCommitted(true);
    setImportStep(3);
    showToast("Valid rows committed to MySQL 8 with transactional atomic guarantee (BR-003)!");
  };

  return (
    <AppLayout
      title="Reports & Data Center"
      subtitle="Financial statements, custom export query builder, and CSV batch ingestion"
    >
      <PageHeader
        title="Reports & Data Operations"
        subtitle="Generate executive statements, schedule recurring packs, and ingest batch CSV data"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Printer size={14} />
              <span>Print View</span>
            </button>
            <button
              onClick={() => showToast("Exporting complete workspace ZIP archive...")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              <Download size={14} />
              <span>Export All (.ZIP)</span>
            </button>
          </div>
        }
      />

      {/* Tabs for Progressive Disclosure */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px ${
            activeTab === "reports"
              ? "border-[#5409DA] text-[#5409DA]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Reports & Financial Statements
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "import"
              ? "border-[#5409DA] text-[#5409DA]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UploadCloud size={14} />
          <span>Import CSV (Batch Ingestion)</span>
        </button>
      </div>

      {activeTab === "reports" ? (
        <div className="space-y-6">
          {/* Custom Report Generator Box */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Statement Generator</h3>
              <p className="text-xs text-slate-500">
                Configure parameters to generate reconciled KPI statements or raw transactional ledgers
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Report Type
                </label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
                >
                  <option value="all-financial">Complete 12-KPI Financial Statement</option>
                  <option value="sales-ledger">Reconciled Sales Transactions & Tax</option>
                  <option value="rfm-segments">Customer RFM Quintiles & LTV</option>
                  <option value="inventory-rop">Inventory Movements & Reorder Schedule</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Period Range
                </label>
                <DateRangeSelect value={dateRange} onChange={setDateRange} className="w-full" />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateReport}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
                >
                  Generate Statement
                </button>
              </div>
            </div>
          </div>

          {/* Pre-built Saved Reports */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Pre-Built Report Packs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAVED_REPORTS.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                      <StatusBadge status={rep.type} />
                    </div>
                    <div className="text-xs text-slate-500 space-y-1 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>Schedule: {rep.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText size={13} className="text-slate-400" />
                        <span>Format: {rep.format} ({rep.size})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Last run: {rep.lastRun}</span>
                    <button
                      onClick={() => showToast(`Downloaded "${rep.title}" (${rep.format})`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Stepper-based Import Center (Progressive Disclosure) */
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-4 text-center text-xs">
            <div className={`p-2 rounded-lg font-bold ${importStep === 1 ? "bg-[#BBFBFF]/50 text-[#5409DA] border border-[#8DD8FF]/40" : "text-slate-400"}`}>
              1. Upload & Schema
            </div>
            <div className={`p-2 rounded-lg font-bold ${importStep === 2 ? "bg-[#BBFBFF]/50 text-[#5409DA] border border-[#8DD8FF]/40" : "text-slate-400"}`}>
              2. Pre-Commit Validation
            </div>
            <div className={`p-2 rounded-lg font-bold ${importStep === 3 ? "bg-emerald-50 text-emerald-700" : "text-slate-400"}`}>
              3. Atomic Commit
            </div>
          </div>

          {/* Step 1: Upload */}
          {importStep === 1 && (
            <div className="space-y-4">
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50 flex flex-col items-center">
                <UploadCloud size={32} className="text-[#4E71FF] mb-2" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">Upload CSV Data File</h4>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Drag and drop your spreadsheet or click to browse. Strict validation will run before anything commits.
                </p>
                <button
                  onClick={() => setImportStep(2)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
                >
                  Simulate Upload "products_batch_oct.csv"
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Download Official CSV Schema Template</h5>
                  <p className="text-[11px] text-slate-500">Includes required headers, DECIMAL formats, and primary keys</p>
                </div>
                <button
                  onClick={() => showToast("Downloaded template_products_schema.csv")}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Download .CSV
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Pre-Commit Validation */}
          {importStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">Validation Complete (BR-003):</span>
                  <span>3 rows valid, 2 rows flagged with data format or margin errors.</span>
                </div>
                <button
                  onClick={() => showToast("Exporting error rows report...")}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 rounded text-amber-800"
                >
                  Download Errors CSV
                </button>
              </div>

              {/* Preview table */}
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
                        <td className="p-2.5 font-mono text-[#5409DA] font-semibold">{row.sku}</td>
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setImportStep(1)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  onClick={handleCommitImport}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
                >
                  Confirm & Commit Valid Rows
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Committed */}
          {importStep === 3 && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-900">Batch Ingestion Committed</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Valid items were written to MySQL 8 with full transaction logging. Erroneous items were isolated for review.
              </p>
              <button
                onClick={() => {
                  setImportStep(1);
                  setActiveTab("reports");
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Return to Reports
              </button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
