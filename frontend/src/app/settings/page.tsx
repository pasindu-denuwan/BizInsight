"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import {
  Building2,
  User,
  DollarSign,
  ShieldCheck,
  History,
  CheckCircle2,
  KeyRound,
  Mail,
  Lock,
  Globe,
  Plus,
} from "lucide-react";

const TEAM_MEMBERS = [
  { id: "mem-1", name: "Jane Doe", email: "jane.doe@acmeretail.com", role: "Owner / Admin", status: "active", joined: "Oct 2024" },
  { id: "mem-2", name: "Marcus Brody", email: "marcus.b@acmeretail.com", role: "Manager", status: "active", joined: "Dec 2024" },
  { id: "mem-3", name: "Aria Montgomery", email: "aria.m@acmeretail.com", role: "Analyst", status: "active", joined: "Feb 2025" },
  { id: "mem-4", name: "Sam Wilson", email: "sam.w@acmeretail.com", role: "Viewer", status: "active", joined: "May 2025" },
];

const AUDIT_LOGS = [
  { id: "AUD-8921", event: "Financial Reconciliation", user: "system_cron", ip: "127.0.0.1", time: "2026-10-15 00:00:02 UTC", status: "success", details: "All 12 KPIs reconciled against MySQL 8 transactions." },
  { id: "AUD-8920", event: "CSV Batch Ingestion", user: "jane.doe@acmeretail.com", ip: "192.168.1.45", time: "2026-10-14 16:30:12 UTC", status: "success", details: "Imported 120 products in job #IMP-401." },
  { id: "AUD-8919", event: "User Role Modified", user: "jane.doe@acmeretail.com", ip: "192.168.1.45", time: "2026-10-14 11:20:45 UTC", status: "success", details: "Granted Manager role to marcus.b@acmeretail.com." },
  { id: "AUD-8918", event: "Export Ledger Generated", user: "aria.m@acmeretail.com", ip: "192.168.1.88", time: "2026-10-14 09:15:22 UTC", status: "success", details: "Downloaded Sales Transactions (.CSV)." },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "currency" | "team" | "audit">("profile");
  const { showToast } = useToast();

  // Business profile form state
  const [companyName, setCompanyName] = useState("Acme Retail Corp");
  const [taxId, setTaxId] = useState("US-948210492");
  const [fiscalMonth, setFiscalMonth] = useState("January");

  // Currency form state
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Workspace business profile updated successfully!");
  };

  const handleSaveCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Currency preferences updated across all analytics modules!");
  };

  return (
    <AppLayout
      title="Settings & Administration"
      subtitle="Workspace configuration, user management, and security audit ledger"
    >
      <PageHeader
        title="Settings"
        subtitle="Manage business credentials, role-based access control, and compliance logs"
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "profile" ? "border-[#5409DA] text-[#5409DA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 size={14} />
          <span>Business Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "account" ? "border-[#5409DA] text-[#5409DA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User size={14} />
          <span>Account & Security</span>
        </button>

        <button
          onClick={() => setActiveTab("currency")}
          className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "currency" ? "border-[#5409DA] text-[#5409DA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign size={14} />
          <span>Currency & Regional</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "team" ? "border-[#5409DA] text-[#5409DA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck size={14} />
          <span>Team & Roles (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "audit" ? "border-[#5409DA] text-[#5409DA]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <History size={14} />
          <span>Audit Log Ledger</span>
        </button>
      </div>

      {/* Tab 1: Business Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="max-w-xl p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Company / Workspace Legal Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Corporate Tax ID / Registration</label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Fiscal Year Start Month</label>
            <select
              value={fiscalMonth}
              onChange={(e) => setFiscalMonth(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
            >
              <option value="January">January (Standard Calendar)</option>
              <option value="April">April (UK / Commonwealth Standard)</option>
              <option value="July">July (Mid-year convention)</option>
              <option value="October">October (US Federal Standard)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Account & Security */}
      {activeTab === "account" && (
        <div className="max-w-xl p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5409DA] to-[#4E71FF] text-white font-bold text-base flex items-center justify-center shadow-md shadow-[#5409DA]/30 ring-2 ring-[#BBFBFF]/50">
              JD
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Jane Doe</h4>
              <p className="text-slate-500">jane.doe@acmeretail.com</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Workspace Owner (Supabase Authenticated)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-800">Security Credentials</h5>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter strong password (minimum 8 characters)"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
              />
            </div>
            <button
              onClick={() => showToast("Password updated successfully.")}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Currency & Localization */}
      {activeTab === "currency" && (
        <form onSubmit={handleSaveCurrency} className="max-w-xl p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Reporting Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
            >
              <option value="USD">USD ($) – United States Dollar</option>
              <option value="EUR">EUR (€) – Euro</option>
              <option value="GBP">GBP (£) – British Pound</option>
              <option value="CAD">CAD ($) – Canadian Dollar</option>
              <option value="AUD">AUD ($) – Australian Dollar</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">System Timezone for Reconciled Ledgers</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London / GMT</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              Apply Currency Settings
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Team & Roles */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Workspace Members & Permissions</h3>
              <p className="text-xs text-slate-500">Roles enforced strictly via MySQL `workspace_members` table</p>
            </div>
            <button
              onClick={() => showToast("Invite link copied to clipboard!")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              <Plus size={14} />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">RBAC Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TEAM_MEMBERS.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{m.name}</td>
                    <td className="p-3 text-slate-500">{m.email}</td>
                    <td className="p-3 font-semibold text-[#5409DA]">{m.role}</td>
                    <td className="p-3"><StatusBadge status={m.status} /></td>
                    <td className="p-3 text-slate-400">{m.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Log */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Immutable System Audit Log</h3>
            <p className="text-xs text-slate-500">Tamper-evident record of security actions and reconciliation runs</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Principal User</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Verification Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[#5409DA] font-semibold">{log.id}</td>
                    <td className="p-3 font-bold text-slate-800">{log.event}</td>
                    <td className="p-3 text-slate-600">{log.user}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{log.time}</td>
                    <td className="p-3"><StatusBadge status={log.status} /></td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
