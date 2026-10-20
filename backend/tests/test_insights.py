from decimal import Decimal
import pytest

from app.services.insights.engine import DecisionInsightsEngine


def test_margin_degradation_triggers_on_drop():
    insight = DecisionInsightsEngine.evaluate_margin_degradation(
        category_name="Apparel",
        current_gpm=Decimal("41.5"),
        previous_gpm=Decimal("48.2"),
        sample_transactions=50,
    )
    assert insight is not None
    assert insight.severity == "warning"
    assert "48.2%" in insight.observation
    assert "review" in insight.suggested_action.lower()


def test_margin_degradation_refuses_insufficient_data():
    # If fewer than 30 transactions, refuse to trigger false alarm
    insight = DecisionInsightsEngine.evaluate_margin_degradation(
        category_name="Apparel",
        current_gpm=Decimal("30.0"),
        previous_gpm=Decimal("50.0"),
        sample_transactions=12,
    )
    assert insight is None


def test_stockout_hazard_triggers_critical():
    insight = DecisionInsightsEngine.evaluate_stockout_hazard(
        product_name="ANC Headphones",
        sku="ELEC-HDPH-01",
        qoh=14,
        reorder_point=48,
        daily_velocity=Decimal("3.2"),
        lead_time_days=12,
        supplier_name="SonicTech Audio",
    )
    assert insight is not None
    assert insight.severity == "critical"
    assert "SonicTech Audio" in insight.suggested_action


def test_budget_overrun_triggers_at_15pct():
    insight = DecisionInsightsEngine.evaluate_budget_overrun(
        category_name="Cloud Infrastructure",
        actual_spend=Decimal("4250.00"),
        budgeted_spend=Decimal("3500.00"),
    )
    assert insight is not None
    assert insight.severity == "warning"
    assert "21.4%" in insight.observation
