"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import { Keyboard, Command, Sparkles } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  topBarActions?: React.ReactNode;
}

export function AppLayout({
  children,
  title,
  subtitle,
  topBarActions,
}: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Desktop Window & Keyboard Shortcuts Listener (Desktop Implementation Section 3.1 & 3.2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl key (or Meta on Mac)
      const isCtrl = e.ctrlKey || e.metaKey;

      // Ignore when user is actively typing in an input or textarea (except for Escape)
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (isCtrl) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            router.push("/");
            break;
          case "2":
            e.preventDefault();
            router.push("/sales");
            break;
          case "3":
            e.preventDefault();
            router.push("/customers");
            break;
          case "4":
            e.preventDefault();
            router.push("/inventory");
            break;
          case "5":
            e.preventDefault();
            router.push("/insights");
            break;
          case "6":
            e.preventDefault();
            router.push("/reports");
            break;
          case ",":
            e.preventDefault();
            router.push("/settings");
            break;
          case "f":
          case "F":
            e.preventDefault();
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
            break;
          case "p":
          case "P":
            e.preventDefault();
            window.print();
            break;
          case "e":
          case "E":
            e.preventDefault();
            showToast("Export initiated via desktop shortcut (Ctrl+E)");
            break;
          case "/":
            e.preventDefault();
            setShortcutsModalOpen((prev) => !prev);
            break;
          default:
            break;
        }
      } else if (e.key === "?" && !isInput) {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, showToast]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-[#1F2937]">
      {/* Sidebar (Desktop collapsible + Mobile off-canvas) */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actions={
            <div className="flex items-center gap-2">
              {topBarActions}
              <button
                onClick={() => setShortcutsModalOpen(true)}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Desktop Keyboard Shortcuts (Ctrl+/)"
              >
                <Keyboard size={13} />
                <span>Shortcuts</span>
              </button>
            </div>
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Desktop Keyboard Shortcuts Cheat Sheet Drawer */}
      <SideDrawer
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
        title="Desktop Keyboard Shortcuts"
        subtitle="Accelerate your workflow with native desktop keyboard shortcuts"
        footer={
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xs"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigation
            </h4>
            <div className="space-y-1.5">
              {[
                { key: "Ctrl + 1", desc: "Jump to Dashboard" },
                { key: "Ctrl + 2", desc: "Jump to Sales Analytics" },
                { key: "Ctrl + 3", desc: "Jump to Customers & RFM" },
                { key: "Ctrl + 4", desc: "Jump to Inventory & Catalog" },
                { key: "Ctrl + 5", desc: "Jump to Decision Insights" },
                { key: "Ctrl + 6", desc: "Jump to Reports & CSV Import" },
                { key: "Ctrl + ,", desc: "Open Settings & Administration" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-700">{item.desc}</span>
                  <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded shadow-2xs">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Actions & Controls
            </h4>
            <div className="space-y-1.5">
              {[
                { key: "Ctrl + F", desc: "Focus Global Search" },
                { key: "Ctrl + E", desc: "Export Current Ledger / Statement" },
                { key: "Ctrl + P", desc: "Print Executive Document Layout" },
                { key: "Ctrl + /", desc: "Toggle Shortcuts Helper" },
                { key: "Escape", desc: "Close Active Drawer or Panel" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-700">{item.desc}</span>
                  <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded shadow-2xs">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
}
