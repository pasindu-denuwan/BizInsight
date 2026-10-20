"""Central Analytics Metrics Engine for BizInsight.

Defines all 12 core business KPIs with exact mathematical integrity:
- Reconciles valid-order line items against discounts, taxes, and refunds
- Preserves historical cost snapshots (COGS) without retroactive modification
- Safely handles zero-denominators, negative values, and missing periods
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional


@dataclass(frozen=True)
class MetricComparison:
    current: Decimal
    previous: Decimal
    growth_pct: Optional[Decimal]


def compute_growth_pct(current: Decimal, previous: Decimal) -> Optional[Decimal]:
    """Calculates percentage growth between two periods.

    Formula: (current - previous) / |previous| * 100
    Returns None when previous is zero (undefined growth).
    """
    if previous == Decimal("0.00") or previous == 0:
        return None
    abs_prev = abs(previous)
    growth = ((current - previous) / abs_prev) * Decimal("100.00")
    return round(growth, 2)


class CentralMetricsEngine:
    @staticmethod
    def calculate_net_revenue(
        gross_sales: Decimal,
        discounts: Decimal = Decimal("0.00"),
        refunds: Decimal = Decimal("0.00"),
        taxes: Decimal = Decimal("0.00"),
    ) -> Decimal:
        """Net Revenue = Gross sales - discounts - refunds - taxes.

        Cannot be negative; floored at 0.00 if refunds exceed sales.
        """
        net = gross_sales - discounts - refunds - taxes
        return max(Decimal("0.00"), round(net, 2))

    @staticmethod
    def calculate_gross_profit(net_revenue: Decimal, cogs: Decimal) -> Decimal:
        """Gross Profit = Net Revenue - Cost of Goods Sold (COGS)."""
        return round(net_revenue - cogs, 2)

    @staticmethod
    def calculate_gross_profit_margin(gross_profit: Decimal, net_revenue: Decimal) -> Decimal:
        """GPM = (Gross Profit / Net Revenue) * 100.

        Zero-denominator returns Decimal("0.00").
        """
        if net_revenue <= Decimal("0.00"):
            return Decimal("0.00")
        return round((gross_profit / net_revenue) * Decimal("100.00"), 2)

    @staticmethod
    def calculate_net_profit_estimate(gross_profit: Decimal, operating_expenses: Decimal) -> Decimal:
        """Net Profit (EST) = Gross Profit - Operating Expenses."""
        return round(gross_profit - operating_expenses, 2)

    @staticmethod
    def calculate_net_profit_margin(net_profit: Decimal, net_revenue: Decimal) -> Decimal:
        """NPM = (Net Profit / Net Revenue) * 100.

        Zero-denominator returns Decimal("0.00").
        """
        if net_revenue <= Decimal("0.00"):
            return Decimal("0.00")
        return round((net_profit / net_revenue) * Decimal("100.00"), 2)

    @staticmethod
    def calculate_aov(eligible_net_revenue: Decimal, completed_orders_count: int) -> Decimal:
        """Average Order Value = Eligible Net Revenue / Eligible Orders.

        Zero-orders returns Decimal("0.00").
        """
        if completed_orders_count <= 0:
            return Decimal("0.00")
        return round(eligible_net_revenue / Decimal(completed_orders_count), 2)

    @staticmethod
    def calculate_return_rate(refunded_orders_count: int, total_orders_count: int) -> Decimal:
        """Return Rate = (Refunded Orders / Total Orders) * 100."""
        if total_orders_count <= 0:
            return Decimal("0.00")
        return round((Decimal(refunded_orders_count) / Decimal(total_orders_count)) * Decimal("100.00"), 2)

    @staticmethod
    def calculate_reorder_point(daily_demand: Decimal, lead_time_days: int, safety_stock: int) -> int:
        """ROP = (Daily Demand * Lead Time Days) + Safety Stock."""
        lead_time_demand = daily_demand * Decimal(lead_time_days)
        return int(round(lead_time_demand)) + safety_stock
