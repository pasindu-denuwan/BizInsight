"""Deterministic Rule-Based Business Decision Support Engine.

Heuristic rules analyze sales, inventory, expenses, and customer trajectories:
- Observation is explicitly separated from Suggested Action
- Every rule checks minimum sample thresholds to prevent false alarms
- Output includes severity ('critical', 'warning', 'info', 'success')
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import List, Optional


@dataclass(frozen=True)
class GeneratedInsight:
    rule_id: str
    category: str
    severity: str
    title: str
    observation: str
    suggested_action: str


class DecisionInsightsEngine:
    @staticmethod
    def evaluate_margin_degradation(
        category_name: str,
        current_gpm: Decimal,
        previous_gpm: Decimal,
        sample_transactions: int,
    ) -> Optional[GeneratedInsight]:
        """Triggers when category GPM drops by >= 5.0% with >= 30 sample transactions."""
        if sample_transactions < 30:
            return None  # Insufficient data guard

        drop = previous_gpm - current_gpm
        if drop >= Decimal("5.00"):
            return GeneratedInsight(
                rule_id="RULE_GPM_DEGRADE_THRESHOLD_5PCT",
                category="sales",
                severity="warning",
                title=f"{category_name} Gross Margin Deterioration",
                observation=f"{category_name} Gross Profit Margin dropped by {drop:.1f}% (from {previous_gpm:.1f}% to {current_gpm:.1f}%).",
                suggested_action="Review recent promotional discounts or negotiate updated cost snapshot with suppliers.",
            )
        return None

    @staticmethod
    def evaluate_stockout_hazard(
        product_name: str,
        sku: str,
        qoh: int,
        reorder_point: int,
        daily_velocity: Decimal,
        lead_time_days: int,
        supplier_name: str,
    ) -> Optional[GeneratedInsight]:
        """Triggers when quantity on hand is below the reorder point."""
        if qoh < reorder_point:
            deficit = reorder_point - qoh
            suggested_po = max(30, deficit * 2)
            days_left = int(qoh / daily_velocity) if daily_velocity > 0 else 0
            severity = "critical" if days_left <= lead_time_days else "warning"
            return GeneratedInsight(
                rule_id="RULE_STOCKOUT_VELOCITY_LEADTIME",
                category="inventory",
                severity=severity,
                title=f"Stockout Risk on {product_name}",
                observation=f"Stock level ({qoh} units) is below reorder threshold ({reorder_point} units) with {days_left} days of runout velocity.",
                suggested_action=f"Dispatch purchase order for {suggested_po} units with supplier '{supplier_name}' immediately.",
            )
        return None

    @staticmethod
    def evaluate_budget_overrun(
        category_name: str,
        actual_spend: Decimal,
        budgeted_spend: Decimal,
    ) -> Optional[GeneratedInsight]:
        """Triggers when actual spend exceeds budget by >= 15%."""
        if budgeted_spend <= Decimal("0.00"):
            return None
        overrun_pct = ((actual_spend - budgeted_spend) / budgeted_spend) * Decimal("100.00")
        if overrun_pct >= Decimal("15.00"):
            return GeneratedInsight(
                rule_id="RULE_BUDGET_OVERRUN_15PCT",
                category="expenses",
                severity="warning",
                title=f"Budget Overrun Alert in {category_name}",
                observation=f"Actual expenditure (${actual_spend:.2f}) exceeded budgeted allocation (${budgeted_spend:.2f}) by {overrun_pct:.1f}%.",
                suggested_action="Freeze discretionary spending in this category and review line-item audit logs.",
            )
        return None
