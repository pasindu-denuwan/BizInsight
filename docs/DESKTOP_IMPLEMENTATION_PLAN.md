# BizInsight – Desktop Software Implementation & Transition Plan

**Product:** BizInsight – Business Analytics & Decision Support System  
**Architecture:** Next.js App Router (TypeScript strict, Tailwind CSS 4) + Electron Desktop Shell + FastAPI (Python 3.12, SQLAlchemy 2) + MySQL 8.0  
**Status:** Phases 0–5 Redesign Implemented & Verified with 0 Build Errors.

---

## 1. Guiding Principles Compliance

1. **Refactor UI Layer Only:**
   - Stack, MySQL schema, API routes (`/api/v1`), Supabase authentication, and analytics math remain 100% intact.
2. **Progressive Disclosure (Nothing Deleted):**
   - 4 Top-line KPIs on Dashboard (Revenue, Expenses, Net Profit, Sales) + "View all 12 reconciled financial KPIs" expansion.
   - Products & COGS merged into Inventory tab view (`/inventory`).
   - Forecasting engine & holdout backtesting merged into Insights (`/insights`).
   - CSV Import batch validator merged into Reports (`/reports`).
   - Team & RBAC and Audit Log ledger merged into Settings (`/settings`).
3. **Desktop First:**
   - Window minimum size: `1024 x 700`.
   - Single-instance application lock (`app.requestSingleInstanceLock()`).
   - Window size and position persistence in `window-state.json`.
   - System native keyboard shortcuts: `Ctrl+1..6`, `Ctrl+,`, `Ctrl+F`, `Ctrl+E`, `Ctrl+P`, `Ctrl+/`.
   - Slide-over `SideDrawer` replaces disruptive popup modal windows.
   - Native file dialog integration (`dialog.showOpenDialog` and `dialog.showSaveDialog`).

---

## 2. Answers to Section 8: Information Needed to Finalize

### 8.1 Current Language / Framework of BizInsight
- **Frontend:** Next.js 16 (App Router, strict TypeScript, Tailwind CSS 4, Recharts, Lucide React, TanStack Query, React Hook Form, Zod).
- **Backend:** FastAPI (Python 3.12, Pydantic, SQLAlchemy 2.0, PyMySQL, PyJWT, Alembic).
- **Desktop Runtime:** Electron desktop shell wrapping the Next.js frontend with preload context bridge.

### 8.2 Where the Data Lives
- **Database Engine:** MySQL 8.0 strictly (multi-workspace isolation, `DECIMAL(12,2)` monetary math, audited ledger, UTC timestamps).
- **Communication:** Secure Bearer JWT to FastAPI modular monolith at `/api/v1/workspaces/{workspace_id}/...`.
- **Local Cache Option:** Local SQLite or IndexedDB query cache via TanStack Query for offline persistence.

### 8.3 Target Operating Systems
- **Primary:** Windows 10/11 (64-bit installer `.exe` / MSI).
- **Secondary / Cross-Platform:** macOS (Universal DMG) and Linux (`.AppImage` / `.deb`), supported natively by Electron.

### 8.4 Single-User vs Multi-User & Offline Support
- **Multi-Workspace & Multi-User:** Workspaces isolated by foreign key, RBAC enforced by MySQL `workspace_members` table (Owner, Admin, Manager, Analyst, Viewer).
- **Offline Resilience:** Reads cached through TanStack Query (`staleTime: 60s`); write actions queued or validated with atomic pre-commit error detection.

---

## 3. Desktop Shell & Navigation Matrix

### 3.1 6 Core Navigation Routes + Pinned Bottom

| Route | Desktop Title | Shortcut | Primary Purpose | Displaced Feature Integration |
| :--- | :--- | :--- | :--- | :--- |
| `/` | **Dashboard** | `Ctrl + 1` | 4 primary KPIs + 2 charts + Recent Sales + Top Insights | All 12 central KPIs accessible via single-click expander |
| `/sales` | **Sales Analytics** | `Ctrl + 2` | Net sales, quarterly/monthly trajectory, transaction ledger | Order detail `SideDrawer`, channel attribution, advanced filters drawer |
| `/customers`| **Customer RFM** | `Ctrl + 3` | RFM quintile segmentation, active customer table | Customer profile `SideDrawer` with 1-5 RFM scores and LTV estimates |
| `/inventory`| **Inventory & Catalog**| `Ctrl + 4`| Stock levels, low-stock alerts, explainable ROP formula | Displaced "Products & COGS" catalog; "Add Product" drawer; ROP calculation sheet |
| `/insights` | **Decision Insights** | `Ctrl + 5` | Rule-based heuristics, actionable advice, 3-mo forecast | Displaced "Forecasting" page; time-ordered holdout backtest methodology expander |
| `/reports` | **Reports & Data** | `Ctrl + 6` | Saved statement packs, custom generator, print view | Displaced "Import Center"; 3-step CSV validation stepper |
| `/settings` | **Settings** | `Ctrl + ,` | Business profile, currency, timezone, credentials | Displaced "Team & Roles" (RBAC) and "Audit Log" immutable ledger |

### 3.2 Native Keyboard Shortcuts Implemented

| Shortcut | Action | Implementation |
| :--- | :--- | :--- |
| `Ctrl + 1` | Navigate to Dashboard | `router.push('/')` & Native App Menu Accelerator |
| `Ctrl + 2` | Navigate to Sales | `router.push('/sales')` & Native App Menu Accelerator |
| `Ctrl + 3` | Navigate to Customers | `router.push('/customers')` & Native App Menu Accelerator |
| `Ctrl + 4` | Navigate to Inventory | `router.push('/inventory')` & Native App Menu Accelerator |
| `Ctrl + 5` | Navigate to Insights | `router.push('/insights')` & Native App Menu Accelerator |
| `Ctrl + 6` | Navigate to Reports | `router.push('/reports')` & Native App Menu Accelerator |
| `Ctrl + ,` | Open Settings | `router.push('/settings')` & Native App Menu Accelerator |
| `Ctrl + F` | Focus Global Search | Automatically focuses header search input and selects text |
| `Ctrl + E` | Export Current Ledger | Dispatches export command with Toast confirmation |
| `Ctrl + P` | Print Executive Layout | Dispatches print stylesheet (`window.print()`) |
| `Ctrl + /` or `?` | Toggle Shortcuts Cheat Sheet | Opens interactive SlideDrawer listing all shortcuts |
| `Escape` | Dismiss Open Drawer / Modal | Closes any open `SideDrawer` and restores scroll |

---

## 4. Reusable Component Inventory

- `AppLayout`: Desktop-first container with collapsible sidebar, top bar, keyboard shortcut listeners, and notification drawer.
- `Sidebar`: Exactly 6 core items, Settings and Profile pinned bottom, tooltips on collapsed mode, persistent state in `localStorage`.
- `TopBar`: Page context, search shortcut hint (`Ctrl+F`), MySQL live sync indicator, alerts drawer.
- `PageHeader`: Title, subtitle, action buttons.
- `KpiCard`: Icon, title, large value, trend indicator (green up / red down, % vs prior period), formula tooltip.
- `ChartCard`: Card wrapper with title, subtitle, loading skeleton, and empty state.
- `DataTable`: Search, sortable columns, pagination, horizontal scroll, and row-click event.
- `SideDrawer`: Slide-over from right replacing modal popups (ESC listener, scroll lock).
- `StatusBadge`: Consistent colors (`success`, `warning`, `danger`, `neutral`, `info`).
- `DateRangeSelect`: Shared dropdown across Dashboard, Sales, and Reports.
- `InsightCard`: Heuristic observation paired with actionable recommendation and severity badge.
- `ToastProvider`: Crisp non-intrusive action feedback replacing browser `alert()` popups.

---

## 5. Build & Verification Results

- **Next.js Production Build:** Completed successfully with **0 errors**.
- **Static Pages Generated:** 14/14 routes pre-rendered.
- **Backward Compatibility:** Direct visits to `/products` and `/expenses` seamlessly redirect to `/inventory` and `/reports`.
