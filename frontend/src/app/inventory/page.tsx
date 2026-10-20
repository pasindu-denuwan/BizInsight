"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  Calculator,
  Package,
  Layers,
  ArrowRight,
} from "lucide-react";

interface InventoryProduct {
  sku: string;
  name: string;
  category: string;
  supplier: string;
  cost: number;
  price: number;
  qoh: number;
  daily_demand: number;
  lead_time_days: number;
  safety_stock: number;
  reorder_point: number;
  suggested_qty: number;
  turnover: number;
  status: "critical" | "warning" | "healthy";
}

const INITIAL_INVENTORY: InventoryProduct[] = [
  {
    sku: "ELEC-HDPH-01",
    name: "Wireless ANC Headphones Pro",
    category: "Electronics",
    supplier: "SonicTech Audio",
    cost: 45.0,
    price: 99.0,
    qoh: 14,
    daily_demand: 3.2,
    lead_time_days: 12,
    safety_stock: 10,
    reorder_point: 48,
    suggested_qty: 60,
    turnover: 6.8,
    status: "critical",
  },
  {
    sku: "APP-JKT-WTR",
    name: "Waterproof Alpine Jacket (L)",
    category: "Apparel",
    supplier: "Apex Outdoor Apparel",
    cost: 55.0,
    price: 139.0,
    qoh: 8,
    daily_demand: 1.8,
    lead_time_days: 15,
    safety_stock: 8,
    reorder_point: 35,
    suggested_qty: 45,
    turnover: 4.2,
    status: "critical",
  },
  {
    sku: "HOME-BLND-04",
    name: "High-Speed Vortex Blender",
    category: "Home & Kitchen",
    supplier: "KitchenCraft Ltd",
    cost: 38.0,
    price: 89.99,
    qoh: 22,
    daily_demand: 2.1,
    lead_time_days: 10,
    safety_stock: 12,
    reorder_point: 33,
    suggested_qty: 40,
    turnover: 5.1,
    status: "warning",
  },
  {
    sku: "SPRT-MAT-PRO",
    name: "Eco-Grip Yoga Mat (6mm)",
    category: "Sports & Fitness",
    supplier: "Zenith Active Gear",
    cost: 16.0,
    price: 48.0,
    qoh: 84,
    daily_demand: 2.4,
    lead_time_days: 7,
    safety_stock: 15,
    reorder_point: 32,
    suggested_qty: 0,
    turnover: 7.4,
    status: "healthy",
  },
  {
    sku: "BEAU-SRM-VITC",
    name: "Vitamin C Radiance Serum",
    category: "Beauty & Health",
    supplier: "PureGlow Laboratories",
    cost: 9.5,
    price: 34.0,
    qoh: 110,
    daily_demand: 3.8,
    lead_time_days: 14,
    safety_stock: 20,
    reorder_point: 73,
    suggested_qty: 0,
    turnover: 8.9,
    status: "healthy",
  },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryProduct[]>(INITIAL_INVENTORY);
  const [activeTab, setActiveTab] = useState<"reorder" | "catalog">("reorder");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const { showToast } = useToast();

  // New product form state
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newCost, setNewCost] = useState("30.00");
  const [newPrice, setNewPrice] = useState("69.99");
  const [newQoh, setNewQoh] = useState("50");

  const lowStockCount = items.filter((i) => i.status === "critical" || i.status === "warning").length;

  const filteredItems = items.filter((item) => {
    if (lowStockOnly) {
      return item.status === "critical" || item.status === "warning";
    }
    return true;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    const newItem: InventoryProduct = {
      sku: newSku,
      name: newName,
      category: newCategory,
      supplier: "Direct Sourced",
      cost: parseFloat(newCost) || 0,
      price: parseFloat(newPrice) || 0,
      qoh: parseInt(newQoh) || 0,
      daily_demand: 1.5,
      lead_time_days: 10,
      safety_stock: 10,
      reorder_point: 25,
      suggested_qty: 0,
      turnover: 5.0,
      status: parseInt(newQoh) < 25 ? "warning" : "healthy",
    };

    setItems([newItem, ...items]);
    setAddDrawerOpen(false);
    showToast(`Product "${newName}" added to catalog successfully!`);
    setNewSku("");
    setNewName("");
  };

  const reorderColumns: Column<InventoryProduct>[] = [
    {
      key: "sku",
      header: "SKU",
      render: (row) => (
        <span className="font-mono font-medium text-[#5409DA] bg-[#BBFBFF]/50 border border-[#8DD8FF]/40 px-1.5 py-0.5 rounded text-[11px]">
          {row.sku}
        </span>
      ),
    },
    {
      key: "name",
      header: "Product Name",
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block">{row.name}</span>
          <span className="text-[11px] text-slate-400">{row.supplier}</span>
        </div>
      ),
    },
    { key: "qoh", header: "On Hand", align: "center", render: (r) => <span className="font-bold text-slate-900">{r.qoh}</span> },
    { key: "daily_demand", header: "Daily Velocity", align: "center" },
    { key: "lead_time_days", header: "Lead Time", align: "center", render: (r) => `${r.lead_time_days}d` },
    { key: "reorder_point", header: "Reorder Pt (ROP)", align: "center", render: (r) => <span className="font-bold text-[#5409DA]">{r.reorder_point}</span> },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const catalogColumns: Column<InventoryProduct>[] = [
    {
      key: "sku",
      header: "SKU",
      render: (row) => (
        <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
          {row.sku}
        </span>
      ),
    },
    {
      key: "name",
      header: "Product Name",
      render: (row) => <span className="font-semibold text-slate-800">{row.name}</span>,
    },
    { key: "category", header: "Category" },
    {
      key: "cost",
      header: "Unit Cost (COGS)",
      align: "right",
      render: (r) => formatCurrency(r.cost),
    },
    {
      key: "price",
      header: "Retail Price",
      align: "right",
      render: (r) => <span className="font-bold">{formatCurrency(r.price)}</span>,
    },
    {
      key: "margin",
      header: "Gross Margin",
      align: "right",
      render: (r) => {
        const margin = ((r.price - r.cost) / r.price) * 100;
        return <span className="font-semibold text-emerald-600">{margin.toFixed(1)}%</span>;
      },
    },
  ];

  return (
    <AppLayout
      title="Inventory & Catalog"
      subtitle="Stock levels, explainable reorder heuristics, and COGS catalog"
    >
      <PageHeader
        title="Inventory & Stock Control"
        subtitle="Real-time stock monitoring with explainable formula: ROP = (Demand × Lead Time) + Safety Stock"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                lowStockOnly
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <AlertTriangle size={14} className={lowStockOnly ? "text-rose-600" : "text-slate-400"} />
              <span>Low Stock Only ({lowStockCount})</span>
            </button>
            <button
              onClick={() => setAddDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          </div>
        }
      />

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Catalog Products"
          value={items.length.toString()}
          previousValue="54"
          growthPct={3.7}
          icon={Package}
          formula="Active catalog SKUs tracked in MySQL 8 inventory"
        />
        <KpiCard
          title="Low Stock / Stockout Risk"
          value={lowStockCount.toString()}
          previousValue="4"
          growthPct={-25.0}
          invertColor={true}
          icon={AlertTriangle}
          formula="SKUs where Quantity on Hand <= Reorder Point"
        />
        <KpiCard
          title="Inventory Turnover"
          value="5.4x"
          previousValue="5.1x"
          growthPct={5.88}
          icon={Boxes}
          formula="Annualized COGS / Average Inventory Balance"
        />
      </div>

      {/* Tab Navigation for Progressive Disclosure */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("reorder")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px ${
            activeTab === "reorder"
              ? "border-[#5409DA] text-[#5409DA]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Reorder & Stock Balance
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-2.5 transition-colors border-b-2 -mb-px ${
            activeTab === "catalog"
              ? "border-[#5409DA] text-[#5409DA]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Product Catalog & COGS Snapshot
        </button>
      </div>

      {/* Main Table */}
      {activeTab === "reorder" ? (
        <DataTable
          title="Stock Balance & Reorder Points"
          data={filteredItems}
          columns={reorderColumns}
          searchPlaceholder="Search product name or SKU..."
          searchKey="name"
          onRowClick={(prod) => setSelectedProduct(prod)}
          pageSize={6}
        />
      ) : (
        <DataTable
          title="Product Catalog & COGS Pricing"
          data={items}
          columns={catalogColumns}
          searchPlaceholder="Search catalog SKU or name..."
          searchKey="name"
          pageSize={6}
        />
      )}

      {/* Product Detail & ROP Formula Explanation Drawer */}
      <SideDrawer
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct ? selectedProduct.name : "Product Details"}
        subtitle={selectedProduct ? `${selectedProduct.sku} • Supplier: ${selectedProduct.supplier}` : ""}
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => {
                showToast(`Purchase order drafted for ${selectedProduct?.suggested_qty || 50} units of ${selectedProduct?.sku}!`);
                setSelectedProduct(null);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Draft Purchase Order
            </button>
          </div>
        }
      >
        {selectedProduct && (
          <div className="space-y-4 text-xs">
            {/* Status overview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Inventory Status:</span>
                <StatusBadge status={selectedProduct.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current On Hand:</span>
                <span className="font-bold text-slate-900">{selectedProduct.qoh} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calculated ROP:</span>
                <span className="font-bold text-[#5409DA]">{selectedProduct.reorder_point} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stock Deficit:</span>
                <span className="font-semibold text-rose-600">
                  {Math.max(0, selectedProduct.reorder_point - selectedProduct.qoh)} units below threshold
                </span>
              </div>
            </div>

            {/* Explainable ROP Formula breakdown (BR-004) */}
            <div className="p-4 rounded-xl bg-[#BBFBFF]/30 border border-[#8DD8FF]/40 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#5409DA] font-bold">
                <Calculator size={15} />
                <span>Explainable Reorder Calculation</span>
              </div>
              <div className="text-[11px] text-slate-800 font-mono bg-white/90 p-2 rounded border border-[#8DD8FF]/30">
                ROP = ({selectedProduct.daily_demand} demand/day × {selectedProduct.lead_time_days} days) + {selectedProduct.safety_stock} safety stock
                <br />
                = {Math.round(selectedProduct.daily_demand * selectedProduct.lead_time_days)} + {selectedProduct.safety_stock} = <strong>{selectedProduct.reorder_point} units</strong>
              </div>
            </div>

            {/* Pricing snapshots */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Unit Cost (COGS):</span>
                <span className="font-semibold text-slate-800">{formatCurrency(selectedProduct.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Catalog Price:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(selectedProduct.price)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
                <span className="text-slate-900">Gross Margin:</span>
                <span className="text-emerald-600">
                  {(((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </SideDrawer>

      {/* Add Product Drawer */}
      <SideDrawer
        isOpen={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        title="Add New Catalog Product"
        subtitle="Register SKU, historical COGS baseline, and safety stock parameters"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAddDrawerOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:from-[#4E71FF] hover:to-[#5409DA] text-white shadow-xs shadow-[#5409DA]/25 transition-all"
            >
              Save Product
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">SKU Code</label>
            <input
              type="text"
              required
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              placeholder="e.g. ELEC-SPK-02"
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Product Title</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Wireless Ergonomic Mouse"
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
            >
              <option value="Electronics">Electronics</option>
              <option value="Apparel">Apparel</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Beauty & Health">Beauty & Health</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Retail Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Initial Quantity on Hand</label>
            <input
              type="number"
              value={newQoh}
              onChange={(e) => setNewQoh(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>
        </form>
      </SideDrawer>
    </AppLayout>
  );
}
