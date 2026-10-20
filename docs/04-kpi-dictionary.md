# BizInsight – Central KPI Dictionary & Mathematical Formulations

This document specifies the single source of truth for all business metric calculations executed by `services/analytics/metrics.py`.

---

## 1. Net Revenue
- **Definition:** Valid customer sales after applying all line-level and order-level discounts, refunds, cancellations, and statutory taxes.
- **Formula:**
  $$\text{Net Revenue} = \sum_{\text{completed orders}} (\text{Line Items Total} - \text{Discount Total} - \text{Refund Total} - \text{Tax Total})$$
- **Edge cases:**
  - Cancelled orders: $\text{Revenue} = 0$
  - Fully refunded orders: $\text{Revenue} = 0$
  - Partially refunded orders: Deduct exact refund amount snapshot from line item total.
  - Zero-sales period: Returns `$0.00`, growth percentage is marked `N/A`.

---

## 2. Gross Profit (GP)
- **Definition:** Net Revenue minus Cost of Goods Sold (COGS), calculated strictly using cost snapshots taken at the time of sale.
- **Formula:**
  $$\text{COGS} = \sum (\text{item quantity} \times \text{unit\_cost snapshot})$$
  $$\text{Gross Profit} = \text{Net Revenue} - \text{COGS}$$
- **Integrity Rule:** Historical COGS is NEVER recomputed using current replacement cost. The cost snapshot at time of sale is permanent and immutable.

---

## 3. Gross Profit Margin (GPM)
- **Definition:** The percentage of net revenue retained after incurring direct costs of goods sold.
- **Formula:**
  $$\text{GPM} = \begin{cases} \left(\frac{\text{Gross Profit}}{\text{Net Revenue}}\right) \times 100 & \text{if } \text{Net Revenue} > 0 \\ 0\% & \text{if } \text{Net Revenue} = 0 \end{cases}$$

---

## 4. Net Profit (Labelled Estimate)
- **Definition:** Gross profit minus categorized operating expenses (OPEX).
- **Formula:**
  $$\text{Net Profit} = \text{Gross Profit} - \sum \text{Operating Expenses}$$
- **Integrity Rule:** Must always carry the `(EST)` or `(Estimate)` label in UI and reports because tax withholdings and non-cash depreciation are estimated.

---

## 5. Net Profit Margin (NPM, Estimate)
- **Definition:** The percentage of net revenue that translates into net income after all operational overhead.
- **Formula:**
  $$\text{NPM} = \begin{cases} \left(\frac{\text{Net Profit}}{\text{Net Revenue}}\right) \times 100 & \text{if } \text{Net Revenue} > 0 \\ 0\% & \text{if } \text{Net Revenue} = 0 \end{cases}$$

---

## 6. Average Order Value (AOV)
- **Definition:** The average value of each completed sales transaction.
- **Formula:**
  $$\text{AOV} = \frac{\text{Eligible Net Revenue}}{\text{Count of Eligible Completed Orders}}$$

---

## 7. Return Rate (%)
- **Definition:** The proportion of completed orders that resulted in a full or partial refund.
- **Formula:**
  $$\text{Return Rate} = \left(\frac{\text{Count of Orders with Refund} > 0}{\text{Total Orders}}\right) \times 100$$

---

## 8. Inventory Turnover Ratio
- **Definition:** The frequency with which average inventory is sold and replaced over an annual period.
- **Formula:**
  $$\text{Inventory Turnover} = \frac{\text{Annualized COGS}}{\text{Average Inventory Balance}}$$

---

## 9. Reorder Point (ROP) & Safety Stock (Explainable Formula)
- **Definition:** The stock threshold that triggers a replenishment purchase order.
- **Formula:**
  $$\text{Lead Time Demand} = \text{Daily Demand Velocity} \times \text{Supplier Lead Time (Days)}$$
  $$\text{Safety Stock} = Z \times \sigma_{\text{demand}} \times \sqrt{\text{Lead Time}}$$
  $$\text{Reorder Point (ROP)} = \text{Lead Time Demand} + \text{Safety Stock}$$
  $$\text{Suggested Order Qty} = \max(0, \text{Target Maximum Stock} - \text{Quantity on Hand})$$
