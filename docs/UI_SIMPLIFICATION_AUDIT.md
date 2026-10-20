# BizInsight UI Simplification: Phase 0 Discovery & Audit

## 1. Stack Mapping
- **Frontend Framework:** Next.js 16 (App Router, TypeScript Strict, Webpack mode)
- **UI Library & Styling:** Tailwind CSS 4, CSS Design Tokens, Lucide React icons
- **Charting Library:** Recharts (ResponsiveContainer, AreaChart, BarChart, LineChart)
- **State Management & Data Fetching:** React Hooks, TanStack React Query, React Hook Form + Zod
- **Backend & Database:** FastAPI (Python 3.12, Pydantic, SQLAlchemy 2.0), MySQL 8.0 strict
- **Auth Method:** Supabase Auth (Identity verification via JWKS / JWT tokens)

---

## 2. Feature & Route Inventory / Migration Map

| Feature | Current Location | Used by API / Service | New Location (Simplified UI) | Migration Action | Progressive Disclosure Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **12 Central KPIs Grid** | `/` (Dashboard) | `/analytics/kpis` | `/` (Dashboard) & `/sales`, `/expenses` | **Keep & Consolidate** | Top 4 primary KPIs on Dashboard (Revenue, Expenses, Profit, Sales). Full 12 KPIs accessible via "All Financial Metrics" expandable sheet/drawer. |
| **12-Month Financial Trajectory** | `/` (Dashboard) | `/analytics/dashboard` | `/` (Dashboard) | **Keep** | Revenue & Profit area chart featured on desktop (stacked on mobile). |
| **Revenue by Category** | `/` (Dashboard) | `/analytics/sales/by-category` | `/` (Dashboard) | **Keep** | Clean horizontal bar chart paired with Revenue Overview. |
| **Rule-Based Insights List** | `/` (Dashboard) | `/insights` | `/` (Dashboard) & `/insights` | **Merge & Progressive** | Top 3 actionable insights on Dashboard bottom row; deep-dive on `/insights`. |
| **Inventory Reorder Alerts** | `/` (Dashboard) | `/analytics/inventory/recommendations` | `/inventory` | **Move** | Moved to `/inventory` as core reorder module with ROP formula drawer. |
| **Sales Temporal Drilldown** | `/sales` | `/analytics/sales/trends` | `/sales` | **Keep & Refine** | Tabs for Quarterly, Monthly, Daily; row-click drawer for transaction breakdown. |
| **Sales Transactions Ledger** | `/sales` | `/workspaces/{id}/sales` | `/sales` | **Keep & Standardize** | Uses shared `DataTable` with search, sort, pagination, export, and `SideDrawer`. |
| **Channel Attribution Breakdown**| `/sales` | `/analytics/sales/by-channel` | `/sales` | **Keep** | Tab / view within Sales analytics. |
| **Customer RFM Segments** | `/customers` | `/analytics/customers/rfm` | `/customers` | **Keep & Polish** | Segment chip filter + customer ledger; row-click opens profile `SideDrawer`. |
| **Explainable Reorder Engine** | `/inventory` | `/analytics/inventory/recommendations` | `/inventory` | **Keep & Polish** | Table with low-stock filter toggle, "Add Product" drawer, ROP explanation sheet. |
| **Product Catalog & COGS** | `/products` (prev standalone) | `/workspaces/{id}/products` | `/inventory` (Catalog tab) & `/products` | **Merge & Redirect** | Accessible as Catalog view in Inventory; `/products` route redirects seamlessly. |
| **Expense & Budget Tracking** | `/expenses` (prev standalone) | `/workspaces/{id}/expenses` | `/reports` & `/settings` & `/expenses` | **Merge & Redirect** | Summary in Dashboard KPI & Reports; `/expenses` redirects/renders cleanly. |
| **Decision Insights Engine** | `/insights` | `/insights` | `/insights` | **Keep & Enrich** | Active insights, recommendations, and integrated Sales Forecast with holdout methodology. |
| **Demand Forecasting & Holdout** | `/forecasting` (prev standalone)| `/forecasts/sales` | `/insights` & `/forecasting` | **Merge & Redirect** | Integrated into Insights as forecast chart + methodology expander; `/forecasting` route redirects. |
| **CSV Import & Validator** | `/imports` (prev standalone) | `/imports` | `/reports` (Import tab) & `/imports` | **Merge & Redirect** | Integrated into Reports Center as a 3-step import wizard; `/imports` route redirects. |
| **Report Center & Packs** | `/reports` | `/reports` | `/reports` | **Keep & Expand** | Pre-built packs, custom query generator, print view, and CSV import tab. |
| **Workspace & App Settings** | `/settings` | `/workspaces/{id}` | `/settings` | **Expand** | Profile, Account, Currency, Team Roles, and Audit Log in clear tabs. |
| **Team & Roles** | `/team` | `/workspaces/{id}/members` | `/settings` (Team tab) | **Move** | User management & RBAC in Settings tab. |
| **Audit Log Ledger** | `/audit` | `/workspaces/{id}/audit-logs` | `/settings` (Audit tab) | **Move** | System event ledger in Settings tab. |

---

## 3. Navigation Simplification Matrix

**Old Navigation (14 Items):**
1. Dashboard
2. Sales Analytics
3. Customer RFM
4. Products & COGS
5. Inventory & Reorder
6. Expenses & Budget
7. Insights Engine
8. Forecasting
9. Import Center
10. Reports & Export
11. Alerts & Notifs
12. Team & Roles
13. Audit Log
14. Settings

**New Streamlined Navigation (6 Core Items + Pinned Bottom):**
- **Main Nav:**
  1. `Dashboard` (`/`)
  2. `Sales` (`/sales`)
  3. `Customers` (`/customers`)
  4. `Inventory` (`/inventory`)
  5. `Insights` (`/insights`)
  6. `Reports` (`/reports`)
- **Pinned Bottom:**
  - `Settings` (`/settings` with Business, Account, Team, Audit tabs)
  - `Profile` (User avatar & workspace context)
- **TopBar / Drawers:**
  - `Notifications` (in-app drawer from bell icon)
  - `Global Search` (quick navigation)

---

## 4. KPI Availability & Mathematical Coherence Verification
- **Total Revenue:** Exists in `/analytics/dashboard` ($67,450.00, +9.1% vs prior).
- **Total Expenses:** Exists in `/analytics/dashboard` ($12,800.00, +4.1% vs prior).
- **Net Profit:** Exists in `/analytics/dashboard` ($18,450.00, +14.6% vs prior, labelled estimate).
- **Total Sales (Orders):** Exists in `/analytics/dashboard` (725 orders, +8.2% vs prior).
- **Prior Period Comparison:** Verified across all 4 top-line KPIs.
- **Zero Double-Counting:** All calculations follow documented central metrics.
