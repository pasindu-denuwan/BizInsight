# BizInsight – Antigravity Handoff (single file)

> Paste or attach this file to Antigravity. It contains the project brief, the completed Phase 1 plan, current status, and every source file created so far. The agent should recreate the files exactly at the stated paths, then continue from **"Next actions"**.

## 0. Instructions for the agent

You are a senior full-stack engineer and business analyst. Build **BizInsight – Business Analytics & Decision Support System**, a real, working product (not a static mockup).

**Stack:** Next.js (App Router, strict TypeScript, Tailwind, shadcn/ui, Recharts, TanStack Query/Table, React Hook Form, Zod, date-fns, Lucide) · FastAPI (Python 3.12+, Pydantic, SQLAlchemy 2, Alembic, Uvicorn) · **MySQL 8 only** (no Postgres/SQLite) · Pandas/NumPy/scikit-learn/statsmodels · Supabase Auth (identity only) · Docker Compose · Vercel + Render/Railway.

**Working rules**
1. Work phase by phase; never dump the whole project at once.
2. Create real files, run tests after each module, fix errors before moving on.
3. Never claim a feature works until the code exists and was verified. Never claim tests passed unless they were run.
4. No hard-coded frontend data or fake API responses; everything comes from the backend and MySQL.
5. Authorization is enforced on the backend. Roles come from `workspace_members` in MySQL, never from JWT claims or frontend input. Every business route is scoped by a validated `workspace_id`.
6. No secrets in code. Service-role key stays server-side. `.env.example` has placeholders only.
7. Keep `PROJECT_STATUS.md` updated (completed, pending, known bugs, test results, next action).
8. Keep docs in `/docs` consistent with what is actually implemented.
9. Do not overwrite existing files without checking them first.
10. If credentials are needed, ask me to set them in `.env` and continue with independent work.

**Roles:** Owner/Admin, Manager, Analyst, Viewer (multi-workspace, strict isolation).

**Modules:** 1 Auth & onboarding · 2 Executive dashboard (12 KPIs with period comparison, filters by date/category/channel/location) · 3 Sales analytics (drill-down year→quarter→month→day, CSV export) · 4 Customer analytics (RFM: Champions, Loyal, Potential Loyalists, New, At-Risk, Hibernating; LTV labelled as estimate) · 5 Product analytics (profit uses COGS, never revenue) · 6 Inventory (low/out-of-stock, turnover, dead stock, explainable reorder recommendations using demand, lead time, safety stock) · 7 Expenses & budgets (net profit labelled estimate) · 8 Rule-based insights engine (transparent, testable, no insight on insufficient data; observation separated from suggested action) · 9 Forecasting (moving-average baseline, statistical model, time-ordered split, MAE/RMSE, refuse tiny datasets) · 10 CSV import (templates, column mapping, preview, validation, duplicate detection, error download, confirm before commit, transactional) · 11 Reports/export/print/saved reports · 12 In-app alerts (deduplicated, configurable thresholds; do not claim email or real-time unless real).

**KPI definitions (single central analytics layer):** Net Revenue = valid-order sales after documented discount/refund/cancel/tax policy. Gross Profit = Net Revenue − COGS. GPM = GP / Net Revenue × 100. Net Profit (estimate) = GP − operating expenses. NPM = Net Profit / Net Revenue × 100. AOV = eligible Net Revenue / eligible orders. Sales Growth = (current − previous) / |previous| × 100 when meaningful. Define zero-denominator, negative, missing-data, refund, and incomplete-period behaviour. No double-counting across line items.

**Demo data:** ≥12 months, ≥30 products, ≥100 customers, multiple channels/categories/expense categories, seasonality, declining categories, cancelled orders, refunds, low-stock items, budget overruns, zero-sales periods, products with no sales, labelled clearly as synthetic. Inventory movements must reconcile with balances.

**Testing:** Pytest (API, auth, isolation, KPI math, RFM, CSV validation, inventory, forecasting) · Vitest + React Testing Library · Playwright (sign in, dashboard, period change, filter table, review insight, valid/invalid import, export, unauthorized access blocked).

**Docs to produce in `/docs`:** project charter, BRD, SRS (FR-/NFR- IDs), user stories (Given/When/Then), use cases, process models, DB docs + ER + data dictionary, KPI dictionary, traceability matrix, test plan, user guide, deployment guide, final business analysis report, portfolio case study. Use Mermaid.

**Pages (19):** Sign in, Sign up, Password reset, Onboarding, Dashboard, Sales, Customers, Products, Inventory, Expenses, Insights, Forecasting, Import Center, Reports, Notifications, Team & Roles, Settings, Profile, Audit Log. Design: navy `#111827`, indigo `#4F46E5`, bg `#F8FAFC`; collapsible sidebar, top bar, workspace selector, breadcrumbs, responsive, accessible, loading/empty/error states.

**Phases:** 1 Planning ✅ · 2 Setup (partial) · 3 DB + demo data · 4 Auth + RBAC · 5 Core CRUD (products, customers, sales, expenses, inventory) · 6 Analytics engine · 7 Frontend dashboard · 8 Insights + forecasting · 9 Imports + reports · 10 Testing + security · 11 Deployment.

**Environment caveat from authoring:** Docker and MySQL were not available, so Docker Compose, MySQL connectivity and the Supabase JWKS path are **unverified**. Verify them first on a machine that has them.

---
## 1. Phase 1 plan


### 1.1 System architecture

```mermaid
flowchart LR
  B[Browser<br/>Next.js App Router + TS] -->|Supabase JS: sign in/up| SA[Supabase Auth]
  B -->|HTTPS + Bearer JWT| API[FastAPI /api/v1]
  API -->|verify JWT via JWKS| SA
  API --> SVC[Services: analytics, insights,<br/>forecasting, imports]
  SVC --> REPO[Repositories - SQLAlchemy 2]
  REPO --> DB[(MySQL 8)]
```

**Key decisions**
- **Supabase Auth = identity only.** The browser signs in with Supabase and sends the access token to FastAPI. FastAPI verifies the signature (JWKS for asymmetric signing keys; shared secret only for legacy HS256 projects), checks `exp`/`aud`/`iss`, and uses `sub` as the user id.
- **Authorization lives in MySQL.** Roles come from `workspace_members`, never from JWT claims or a frontend-supplied role. Every business query is scoped by a `workspace_id` validated against the caller's membership (a FastAPI dependency).
- **Service-role key is not needed for token verification.** It is only needed for admin actions such as inviting users, and stays in backend env vars.
- **One analytics layer** (`services/analytics/metrics.py`) defines every KPI once; dashboard, reports, exports and insights all call it.
- **Modular monolith**: routes -> services -> repositories -> models. No microservices.
- Tests that touch the DB run against MySQL (compose `db-test`), not SQLite, because DECIMAL, collation and date behaviour differ.

### 2. MVP scope

**In MVP:** auth, workspaces, RBAC; demo workspace; products/categories, customers, sales orders/items, expenses/budgets, inventory + movements; central KPI engine; executive dashboard; sales, customer (RFM), product, inventory, expense analytics; rule-based insights; baseline + one statistical forecast with backtest; CSV import with preview/validation; CSV export + saved reports; in-app alerts; audit log; tests; docs.

**Post-MVP:** PDF reports, recurring-expense automation, background worker queue, email alerts, multi-currency conversion, SSO, RFM threshold editing UI (config exists in backend in MVP).

### 3. Prioritised backlog
| Pri | Epic |
|---|---|
| P0 | Setup, schema + migrations, seed data, auth/RBAC/isolation |
| P0 | KPI engine + tests, dashboard |
| P0 | Core CRUD (products, customers, sales, expenses, inventory) |
| P1 | Sales/customer/product/inventory/expense analytics |
| P1 | Insights engine, alerts, CSV import, CSV export/reports |
| P2 | Forecasting, audit log UI, saved reports, print layout |
| P3 | PDF export, recurring expenses, email notifications |

### 4. ER diagram (initial)

```mermaid
erDiagram
  users ||--o{ workspace_members : has
  workspaces ||--o{ workspace_members : has
  workspaces ||--o{ products : owns
  workspaces ||--o{ customers : owns
  workspaces ||--o{ sales_orders : owns
  workspaces ||--o{ expenses : owns
  product_categories ||--o{ products : groups
  suppliers ||--o{ products : supplies
  customers ||--o{ sales_orders : places
  sales_orders ||--|{ sales_order_items : contains
  products ||--o{ sales_order_items : sold_as
  sales_orders ||--o{ payment_records : paid_by
  products ||--o{ inventory_movements : moves
  products ||--|| inventory_records : balance
  expense_categories ||--o{ expenses : classifies
  expense_categories ||--o{ budgets : budgeted
  workspaces ||--o{ business_insights : generates
  workspaces ||--o{ alerts : raises
  workspaces ||--o{ saved_reports : saves
  workspaces ||--o{ import_jobs : runs
  import_jobs ||--o{ import_errors : logs
  workspaces ||--o{ audit_logs : records
```

**Financial model.** `sales_orders` carry a status (`completed | cancelled | refunded | partially_refunded | pending`), `discount_total`, `tax_total`, `refund_total`. `sales_order_items` carry `quantity`, `unit_price`, `unit_cost` (cost snapshot at sale time so historical COGS never shifts) and `line_discount`. Revenue is derived from items, never stored as a duplicated total. `inventory_records.quantity_on_hand` must equal the sum of `inventory_movements.quantity_delta` (reconciliation test in Phase 3).

### 5. Folder structure
```
bizinsight/
  backend/app/{api/v1,core,db,models,schemas,repositories,services/{analytics,forecasting,imports,insights},tasks}
  backend/{alembic,tests,scripts/seed_demo.py}
  frontend/src/{app,components,features/<module>,lib/api,hooks,types,schemas}
  docs/  docker-compose.yml  .env.example  PROJECT_STATUS.md
```

### 6. API design (under `/api/v1`)
Business routes are scoped by a path-level `workspace_id` so isolation is explicit and testable.

- `GET /health`, `GET /me`, `GET|POST /workspaces`
- `/workspaces/{id}/products|customers|sales|expenses|inventory|suppliers|budgets`: CRUD, `page`, `page_size<=100`, `sort`, filters
- `/workspaces/{id}/analytics/{dashboard|kpis|sales/trends|sales/by-category|customers/rfm|customers/segments|products|inventory/recommendations|expenses}`
- `/workspaces/{id}/insights` (+ `POST /generate`, `PATCH /{id}` for review/dismiss)
- `/workspaces/{id}/forecasts/sales?horizon=&model=`
- `/workspaces/{id}/imports` (+ `/preview`, `/{job}/commit`, `/{job}/errors.csv`, `/templates/{type}`)
- `/workspaces/{id}/reports`, `/alerts`, `/members`, `/audit-logs`

Errors use one envelope: `{"error": {"code": "...", "message": "...", "details": []}}`.

### 7. Business requirements & measurable acceptance (excerpt)
| ID | Requirement | Acceptance |
|---|---|---|
| BR-001 | Owners see core KPIs in one view | Dashboard shows 12 KPIs, each equal to the KPI engine output for the same filters |
| BR-002 | One business never sees another's data | Cross-workspace requests return 403/404 in all isolation tests |
| BR-003 | Bad imports are handled safely | Invalid rows reported with row number + reason; no partial commits |
| BR-004 | Reorder decisions are explainable | Each recommendation lists demand, lead time and safety-stock inputs |
| BR-005 | Forecasts are honest | Refused below minimum history; MAE/RMSE on a time-ordered holdout shown |

### 8. Risks
| Risk | Mitigation |
|---|---|
| Supabase JWT config mismatch (HS256 vs asymmetric) | Check the project's signing-key type in Phase 4 before writing auth code; support JWKS with optional HS256 fallback |
| MySQL aggregation differences vs Postgres | Use MySQL-compatible SQLAlchemy functions; do heavy time-series work in pandas |
| Demo data coherence | Seed script with reconciliation assertions |
| Scope size | Phase gates; MVP before P2/P3 |

### 9. Implementation checklist
See `PROJECT_STATUS.md`.

---

## 2. Current status


_Last updated: 2026-10-15_

### Environment notes
Authoring sandbox: Python 3.12, Node 22. **No Docker, no MySQL**, so anything DB- or Docker-related is written but UNVERIFIED until run on your machine.

### Phase checklist
- [x] Phase 1: planning (`docs/01-phase1-plan.md`)
- [~] Phase 2: setup
  - [x] FastAPI skeleton: config, versioned router, error envelope, CORS, Supabase JWT verification
  - [x] Smoke tests: 4 passed (health, auth required, valid token, expired/wrong-audience rejected)
  - [x] `.env.example`, `.gitignore`, `docker-compose.yml`, backend Dockerfile (Docker unverified)
  - [ ] Alembic init + first migration (needs MySQL to verify)
  - [ ] Next.js + Tailwind + shadcn/ui scaffold
  - [ ] Ruff/mypy/ESLint config, Vitest + Playwright setup
- [ ] Phase 3: models, migrations, seed + reconciliation checks
- [ ] Phase 4: Supabase auth + RBAC (first confirm project signing-key type: JWKS vs legacy HS256)
- [ ] Phases 5–11 per `docs/01-phase1-plan.md`

### Known issues / limitations
- Docker Compose and MySQL startup not yet verified.
- JWKS path in `core/security.py` is untested against a real Supabase project (HS256 path is tested).
- `PyJWKClient` is created per request; add caching in Phase 4.

### Test results
- 2026-10-15 backend `pytest`: 4 passed.

### Next action
Scaffold the Next.js frontend, then Alembic and the Phase 3 models.

---

## 3. Source files created so far (recreate at these paths)

### `.env.example`

````
# Placeholders only. Copy to .env and fill in. Never commit .env.
MYSQL_ROOT_PASSWORD=change-me-root
MYSQL_DATABASE=bizinsight
MYSQL_USER=bizinsight
MYSQL_PASSWORD=change-me
DATABASE_URL=mysql+pymysql://bizinsight:change-me@db:3306/bizinsight

# Supabase (backend: URL only for JWKS verification; secret only for legacy HS256 projects)
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_JWT_SECRET=
SUPABASE_JWT_AUDIENCE=authenticated
# Server-side only, needed later for inviting users. NEVER expose to the frontend.
SUPABASE_SERVICE_ROLE_KEY=

CORS_ORIGINS=["http://localhost:3000"]

# Frontend (public by design: anon key is safe in the browser)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
````

### `.gitignore`

````
.env
.venv/
__pycache__/
node_modules/
.next/
*.pyc
.pytest_cache/
.mypy_cache/
.ruff_cache/
````

### `docker-compose.yml`

````yaml
# NOT YET VERIFIED: Docker is unavailable in the authoring sandbox.
services:
  db:
    image: mysql:8.0
    env_file: .env
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    command: ["--character-set-server=utf8mb4", "--collation-server=utf8mb4_0900_ai_ci", "--default-time-zone=+00:00"]
    ports: ["3306:3306"]
    volumes: [dbdata:/var/lib/mysql]
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 5s
      retries: 20
  api:
    build: ./backend
    env_file: .env
    depends_on:
      db: { condition: service_healthy }
    ports: ["8000:8000"]
volumes:
  dbdata:
````

### `backend/Dockerfile`

````dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m app && chown -R app /app
USER app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
````

### `backend/requirements.txt`

````
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.4
pydantic-settings==2.7.0
SQLAlchemy==2.0.36
alembic==1.14.0
PyMySQL==1.1.1
cryptography==44.0.0
PyJWT==2.10.1
python-multipart==0.0.20
pandas==2.2.3
numpy==2.2.1
scikit-learn==1.6.0
statsmodels==0.14.4
````

### `backend/requirements-dev.txt`

````
-r requirements.txt
pytest==8.3.4
httpx==0.28.1
ruff==0.8.4
mypy==1.14.0
````

### `backend/pytest.ini`

````ini
[pytest]
pythonpath = .
testpaths = tests
````

### `backend/app/core/config.py`

````python
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from environment variables (see .env.example)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "BizInsight API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    database_url: str = "mysql+pymysql://bizinsight:change-me@localhost:3306/bizinsight"

    # Supabase Auth: used only to VERIFY tokens. No service-role key is needed for that.
    supabase_url: str = ""
    supabase_jwt_secret: str = ""  # legacy HS256 projects only; leave empty for JWKS
    supabase_jwt_audience: str = "authenticated"

    max_upload_mb: int = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()
````

### `backend/app/core/security.py`

````python
"""Supabase JWT verification.

Identity only: returns the Supabase user id (`sub`). Roles and workspace access are
NEVER read from token claims; they are looked up in MySQL (Phase 4).
"""
from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings, get_settings

_bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthUser:
    id: str
    email: str | None


def _unauthorized(msg: str) -> HTTPException:
    return HTTPException(status.HTTP_401_UNAUTHORIZED, msg, headers={"WWW-Authenticate": "Bearer"})


def decode_token(token: str, settings: Settings) -> dict:
    try:
        if settings.supabase_jwt_secret:  # legacy HS256
            return jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience=settings.supabase_jwt_audience,
            )
        if not settings.supabase_url:
            raise _unauthorized("Auth is not configured")
        jwks = jwt.PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")
        key = jwks.get_signing_key_from_jwt(token).key
        return jwt.decode(
            token,
            key,
            algorithms=["ES256", "RS256"],
            audience=settings.supabase_jwt_audience,
            issuer=f"{settings.supabase_url}/auth/v1",
        )
    except HTTPException:
        raise
    except jwt.PyJWTError:
        raise _unauthorized("Invalid or expired token") from None


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    settings: Settings = Depends(get_settings),
) -> AuthUser:
    if creds is None:
        raise _unauthorized("Missing bearer token")
    claims = decode_token(creds.credentials, settings)
    sub = claims.get("sub")
    if not sub:
        raise _unauthorized("Token has no subject")
    return AuthUser(id=sub, email=claims.get("email"))
````

### `backend/app/db/session.py`

````python
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


_engine = None
_SessionLocal: sessionmaker[Session] | None = None


def get_engine():
    global _engine, _SessionLocal
    if _engine is None:
        _engine = create_engine(get_settings().database_url, pool_pre_ping=True)
        _SessionLocal = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)
    return _engine


def get_db() -> Iterator[Session]:
    get_engine()
    assert _SessionLocal is not None
    with _SessionLocal() as session:
        yield session
````

### `backend/app/api/v1/router.py`

````python
from fastapi import APIRouter, Depends

from app.core.security import AuthUser, get_current_user

api_router = APIRouter()


@api_router.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@api_router.get("/me", tags=["auth"])
def me(user: AuthUser = Depends(get_current_user)) -> dict[str, str | None]:
    return {"id": user.id, "email": user.email}
````

### `backend/app/main.py`

````python
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import get_settings


def _err(status_code: int, code: str, message: str, details: list | None = None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message, "details": details or []}},
    )


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.exception_handler(HTTPException)
    async def http_exc(_: Request, exc: HTTPException) -> JSONResponse:
        return _err(exc.status_code, f"http_{exc.status_code}", str(exc.detail))

    @app.exception_handler(RequestValidationError)
    async def validation_exc(_: Request, exc: RequestValidationError) -> JSONResponse:
        details = [{"loc": list(e["loc"]), "msg": e["msg"]} for e in exc.errors()]
        return _err(422, "validation_error", "Request validation failed", details)

    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
````

### `backend/tests/test_smoke.py`

````python
import time

import jwt
from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import create_app

SECRET = "test-secret-at-least-32-bytes-long-xxxx"


def _client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_settings] = lambda: Settings(supabase_jwt_secret=SECRET)
    return TestClient(app)


def _token(**over) -> str:
    claims = {"sub": "u-1", "email": "a@b.co", "aud": "authenticated", "exp": int(time.time()) + 60}
    claims.update(over)
    return jwt.encode(claims, SECRET, algorithm="HS256")


def test_health_is_public():
    r = _client().get("/api/v1/health")
    assert r.status_code == 200 and r.json() == {"status": "ok"}


def test_me_requires_token():
    r = _client().get("/api/v1/me")
    assert r.status_code == 401
    assert r.json()["error"]["code"] == "http_401"


def test_me_accepts_valid_token():
    r = _client().get("/api/v1/me", headers={"Authorization": f"Bearer {_token()}"})
    assert r.status_code == 200 and r.json()["id"] == "u-1"


def test_me_rejects_expired_and_wrong_audience():
    c = _client()
    for tok in (_token(exp=int(time.time()) - 5), _token(aud="other")):
        assert c.get("/api/v1/me", headers={"Authorization": f"Bearer {tok}"}).status_code == 401
````

Also create empty `__init__.py` files in every directory under `backend/app/` (api, api/v1, core, db, models, schemas, repositories, services, services/analytics, services/forecasting, services/imports, services/insights, tasks) and in `backend/tests/`.

Verify with: `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements-dev.txt && pytest` (expected: 4 passed).

---

## 4. Next actions (in order)

1. Run `docker compose up db`; confirm MySQL 8 starts healthy. Fix compose if not.
2. Scaffold `frontend/` (Next.js App Router, TS strict, Tailwind, shadcn/ui, TanStack Query/Table, RHF, Zod, Recharts, Vitest, Playwright).
3. Init Alembic against MySQL; add ruff/mypy/ESLint config.
4. **Phase 3:** SQLAlchemy models for all entities in the ER diagram (DECIMAL money, FK constraints, workspace_id on all business tables, indexes, unique constraints, UTC timestamps), first migration, repeatable `scripts/seed_demo.py` with reconciliation assertions, plus tests.
5. **Phase 4:** First ask me whether my Supabase project uses asymmetric signing keys (JWKS) or the legacy HS256 secret; cache `PyJWKClient`; add `users`/`workspace_members` lookup, `require_role` dependency, and isolation tests.
6. Continue Phases 5–11, updating `PROJECT_STATUS.md` after each.

Begin with step 1 now.
