"use client";

import { useState, useMemo } from "react";

export interface DashboardMetric {
  title: string;
  value: string;
  previousValue: string;
  growthPct: number;
  formula: string;
  isEstimate?: boolean;
  invertColor?: boolean;
}

export function useDashboardData(initialPeriod: string = "Last 30 Days") {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core 4 KPIs required on the simplified dashboard
  const primaryKpis = useMemo(() => {
    return {
      revenue: {
        title: "Total Revenue",
        value: "$67,450.00",
        previousValue: "$61,800.00",
        growthPct: 9.1,
        formula: "Gross Sales − Discounts − Refunds − Taxes",
      },
      expenses: {
        title: "Total Expenses",
        value: "$12,800.00",
        previousValue: "$12,300.00",
        growthPct: 4.1,
        invertColor: true,
        formula: "Sum of logged OPEX across classified categories",
      },
      netProfit: {
        title: "Net Profit",
        value: "$18,450.00",
        previousValue: "$16,100.00",
        growthPct: 14.6,
        isEstimate: true,
        formula: "Gross Profit − Operating Expenses (Labelled Estimate)",
      },
      totalSales: {
        title: "Total Sales",
        value: "725",
        previousValue: "670",
        growthPct: 8.2,
        formula: "Count of non-cancelled sales orders in period",
      },
    };
  }, [selectedPeriod]);

  // Extended KPIs available under progressive disclosure (All 12 KPIs)
  const extendedKpis = useMemo(() => {
    return [
      {
        title: "Gross Profit",
        value: "$31,250.00",
        previousValue: "$28,400.00",
        growthPct: 10.0,
        formula: "Net Revenue − Historical COGS snapshot",
      },
      {
        title: "Gross Profit Margin",
        value: "46.3%",
        previousValue: "45.9%",
        growthPct: 0.87,
        formula: "(Gross Profit / Net Revenue) × 100",
      },
      {
        title: "Net Profit Margin",
        value: "27.4%",
        previousValue: "26.0%",
        growthPct: 5.38,
        isEstimate: true,
        formula: "(Net Profit / Net Revenue) × 100",
      },
      {
        title: "Average Order Value (AOV)",
        value: "$93.03",
        previousValue: "$92.24",
        growthPct: 0.86,
        formula: "Eligible Net Revenue / Eligible Orders",
      },
      {
        title: "Units Sold",
        value: "1,842",
        previousValue: "1,710",
        growthPct: 7.72,
        formula: "Sum of line item quantities in completed orders",
      },
      {
        title: "Refund Total",
        value: "$1,420.00",
        previousValue: "$1,850.00",
        growthPct: -23.2,
        invertColor: true,
        formula: "Total amount refunded to customers in period",
      },
      {
        title: "Return Rate",
        value: "2.1%",
        previousValue: "2.9%",
        growthPct: -27.5,
        invertColor: true,
        formula: "(Refunded Orders / Total Orders) × 100",
      },
      {
        title: "Inventory Turnover",
        value: "5.4x",
        previousValue: "5.1x",
        growthPct: 5.88,
        formula: "Annualized COGS / Average Inventory Balance",
      },
    ];
  }, [selectedPeriod]);

  // Revenue overview chart data
  const revenueTrends = [
    { month: "Nov 25", revenue: 42500, profit: 19400 },
    { month: "Dec 25", revenue: 68900, profit: 31700 },
    { month: "Jan 26", revenue: 38200, profit: 17200 },
    { month: "Feb 26", revenue: 41100, profit: 18700 },
    { month: "Mar 26", revenue: 46800, profit: 21700 },
    { month: "Apr 26", revenue: 51200, profit: 23400 },
    { month: "May 26", revenue: 53900, profit: 24800 },
    { month: "Jun 26", revenue: 56400, profit: 26200 },
    { month: "Jul 26", revenue: 58100, profit: 26600 },
    { month: "Aug 26", revenue: 54200, profit: 24400 },
    { month: "Sep 26", revenue: 61800, profit: 28400 },
    { month: "Oct 26", revenue: 67450, profit: 31250 },
  ];

  // Sales by Category data
  const categoryData = [
    { name: "Electronics", revenue: 184500, share: 32 },
    { name: "Apparel", revenue: 138200, share: 24 },
    { name: "Home & Kitchen", revenue: 109400, share: 19 },
    { name: "Sports & Fitness", revenue: 86300, share: 15 },
    { name: "Beauty & Health", revenue: 57600, share: 10 },
  ];

  // Recent Sales table (5-8 rows)
  const recentSales = [
    { id: "ORD-9421", date: "Oct 14, 2026", customer: "Apex Tech Labs", amount: 2450.0, status: "Completed", channel: "Wholesale B2B", items: 14 },
    { id: "ORD-9420", date: "Oct 14, 2026", customer: "Sophia Martinez", amount: 149.99, status: "Completed", channel: "Online Webstore", items: 2 },
    { id: "ORD-9419", date: "Oct 14, 2026", customer: "Liam Chen", amount: 89.5, status: "Completed", channel: "Amazon", items: 1 },
    { id: "ORD-9418", date: "Oct 14, 2026", customer: "Marcus Brody", amount: 210.0, status: "Refunded", channel: "Online Webstore", items: 3 },
    { id: "ORD-9417", date: "Oct 14, 2026", customer: "Emma Watson", amount: 320.0, status: "Completed", channel: "Showroom POS", items: 4 },
    { id: "ORD-9416", date: "Oct 14, 2026", customer: "TechCraft Studio", amount: 3890.0, status: "Completed", channel: "Wholesale B2B", items: 20 },
  ];

  // Top 3 Business Insights for dashboard bottom row
  const topInsights = [
    {
      id: "ins-1",
      title: "Category Margin Deterioration in Apparel",
      category: "sales",
      severity: "warning" as const,
      observation:
        "Apparel Gross Profit Margin fell from 48.2% to 41.5% due to 3 consecutive promotional clearance events.",
      suggested_action:
        "Review tier-2 discount thresholds or re-negotiate supplier cost snapshot on seasonal lines.",
    },
    {
      id: "ins-2",
      title: "Stockout Risk on Top SKU (Wireless ANC Headphones)",
      category: "inventory",
      severity: "critical" as const,
      observation:
        "Current stock (14 units) is below reorder point (48 units) with lead time of 12 days and daily velocity of 3.2 units.",
      suggested_action:
        "Expedite purchase order for 60 units with Supplier 'SonicTech Audio' immediately.",
    },
    {
      id: "ins-3",
      title: "Customer Segment Expansion: Potential Loyalists",
      category: "customers",
      severity: "success" as const,
      observation:
        "Potential Loyalists segment grew by 24% (42 new customers) following the Autumn campaign.",
      suggested_action:
        "Trigger targeted cross-sell nurture email to migrate cohort to 'Champions'.",
    },
  ];

  return {
    selectedPeriod,
    setSelectedPeriod,
    primaryKpis,
    extendedKpis,
    revenueTrends,
    categoryData,
    recentSales,
    topInsights,
    isLoading,
    error,
  };
}
