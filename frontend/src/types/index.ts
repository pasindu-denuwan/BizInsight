export type UserRole = "owner" | "admin" | "manager" | "analyst" | "viewer";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  currency: string;
  created_at: string;
  role: UserRole;
}

export interface UserProfile {
  id: string;
  email: string | null;
  name?: string;
  workspaces: Workspace[];
  active_workspace_id: string | null;
}

export interface PeriodComparison {
  current: number;
  previous: number;
  growth_pct: number | null;
}

export interface DashboardKPIs {
  net_revenue: PeriodComparison;
  gross_profit: PeriodComparison;
  gross_profit_margin: PeriodComparison;
  net_profit_est: PeriodComparison;
  net_profit_margin: PeriodComparison;
  aov: PeriodComparison;
  total_orders: PeriodComparison;
  units_sold: PeriodComparison;
  refund_total: PeriodComparison;
  return_rate_pct: PeriodComparison;
  inventory_turnover: PeriodComparison;
  operating_expenses: PeriodComparison;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
  cost: number;
  profit: number;
}

export interface CategoryPerformance {
  category_id: string;
  category_name: string;
  revenue: number;
  units: number;
  profit_margin: number;
  share_pct: number;
}

export interface RFMSegmentSummary {
  segment: "Champions" | "Loyal" | "Potential Loyalists" | "New" | "At-Risk" | "Hibernating";
  count: number;
  revenue: number;
  pct_of_customers: number;
}

export interface InventoryReorderAlert {
  product_id: string;
  product_name: string;
  sku: string;
  quantity_on_hand: number;
  daily_demand: number;
  lead_time_days: number;
  safety_stock: number;
  reorder_point: number;
  suggested_order_qty: number;
  status: "ok" | "low_stock" | "out_of_stock";
}

export interface BusinessInsight {
  id: string;
  title: string;
  observation: string;
  suggested_action: string;
  severity: "info" | "warning" | "critical" | "success";
  category: "sales" | "inventory" | "expenses" | "customers";
  created_at: string;
  status: "active" | "reviewed" | "dismissed";
}

export interface SalesForecastPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
  is_historical: boolean;
}

export interface ForecastModelMetrics {
  mae: number;
  rmse: number;
  horizon_days: number;
  model_type: "baseline_moving_avg" | "exponential_smoothing" | "arima";
  training_points_count: number;
}
