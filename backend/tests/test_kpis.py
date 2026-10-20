from decimal import Decimal
import pytest

from app.services.analytics.metrics import CentralMetricsEngine, compute_growth_pct


def test_growth_pct_calculation():
    # Normal positive growth
    assert compute_growth_pct(Decimal("110.00"), Decimal("100.00")) == Decimal("10.00")
    # Normal negative growth
    assert compute_growth_pct(Decimal("80.00"), Decimal("100.00")) == Decimal("-20.00")
    # Zero denominator returns None
    assert compute_growth_pct(Decimal("50.00"), Decimal("0.00")) is None


def test_net_revenue_calculation():
    gross = Decimal("1000.00")
    discount = Decimal("50.00")
    refund = Decimal("30.00")
    tax = Decimal("20.00")
    net = CentralMetricsEngine.calculate_net_revenue(gross, discount, refund, tax)
    assert net == Decimal("900.00")

    # Excess refund floored at zero
    net_floored = CentralMetricsEngine.calculate_net_revenue(Decimal("50.00"), refunds=Decimal("100.00"))
    assert net_floored == Decimal("0.00")


def test_gross_profit_and_margins():
    net_rev = Decimal("1000.00")
    cogs = Decimal("600.00")
    gp = CentralMetricsEngine.calculate_gross_profit(net_rev, cogs)
    assert gp == Decimal("400.00")

    gpm = CentralMetricsEngine.calculate_gross_profit_margin(gp, net_rev)
    assert gpm == Decimal("40.00")

    # Zero revenue handling
    assert CentralMetricsEngine.calculate_gross_profit_margin(Decimal("0.00"), Decimal("0.00")) == Decimal("0.00")


def test_net_profit_estimate_and_npm():
    gp = Decimal("400.00")
    opex = Decimal("250.00")
    net_profit = CentralMetricsEngine.calculate_net_profit_estimate(gp, opex)
    assert net_profit == Decimal("150.00")

    npm = CentralMetricsEngine.calculate_net_profit_margin(net_profit, Decimal("1000.00"))
    assert npm == Decimal("15.00")


def test_aov_calculation():
    net_rev = Decimal("930.30")
    orders = 10
    aov = CentralMetricsEngine.calculate_aov(net_rev, orders)
    assert aov == Decimal("93.03")

    # Zero orders
    assert CentralMetricsEngine.calculate_aov(net_rev, 0) == Decimal("0.00")


def test_explainable_reorder_point():
    # ROP = (Daily Demand * Lead Time) + Safety Stock
    daily_demand = Decimal("3.2")
    lead_time = 12
    safety_stock = 10
    rop = CentralMetricsEngine.calculate_reorder_point(daily_demand, lead_time, safety_stock)
    # 3.2 * 12 = 38.4 -> round to 38 -> + 10 = 48
    assert rop == 48
