# Station 15 (S15) - MVP Underwriting Platform

**Tagline:** Keep Moving

**Core Logic / Brand Equations:**
- S15 > Waiting
- Your Cash Flow > Net Terms
- Motion > Stagnation
- Options > Panic

Station 15 enables service businesses with predictable, recurring revenue to take control of time instead of waiting on it. The platform's core innovation is **time-based underwriting**: limits and terms adapt continuously to live cash-flow data. This MVP demonstrates that logic through two complementary interfaces:

- **Branded User UI**: Shows the experience and emotional benefit of continuous motion
- **Admin / Underwriting Dash**: Exposes and tunes the logic driving that motion

Both connect to a shared simulation and data layer.

## Architecture

**Simulation / Data Layer** → Synthetic transactions, invoices, and rules feeding both User and Admin environments.

### Tech Stack (Per PRD)

- **Frontend (User)**: Next.js + Tailwind + Recharts
- **Frontend (Admin)**: Next.js + Mantine / Vanilla CSS grid
- **Backend**: Supabase (Postgres) + Encore (Go)
- **Data Generation**: Python scripts
- **State**: React Query / Zustand
- **Deployment**: Vercel / Supabase

### Shared Foundations

- **Data Objects**: Business | Transaction | Invoice | RuleEvent | Decision | ModelCard
- **Underwriting Rules (v0)**: 
  - Liquidity ≥ 1.1 ×
  - Recurring ≥ 65%
  - ≥ 3 Cycles
  - Volatility haircut ≈ 35%
- **Cycle Engine**: 30-day increments with Advance/Stress controls

### Brand & Design

**User UI Style:**
- Indigo #312E81 / Crimson #DC143C accents
- Forward chevrons → (motion as time flow)
- Clean cards
- Calm, confident sense of control

**Admin UI Style:**
- Neutral gray grid
- Monospace numerics
- Keyboard shortcuts
- Print-friendly
- Operational truth layer — pure function, no ornament

## Project Structure

```
station15/
├── apps/
│   ├── web/              # Next.js frontend (User + Admin UIs)
│   └── engine/           # Encore Go backend
├── supabase/
│   └── schema.sql        # Database schema with RLS
├── scripts/
│   └── generate_data.py  # Python data generation script
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Quick Start

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Encore CLI](https://encore.dev/docs/install)
- [Node.js 18+](https://nodejs.org/)
- [Go 1.21+](https://golang.org/dl/)
- [GitHub CLI](https://cli.github.com/) (optional, for easier GitHub integration)

### Initial Setup (One-Time)

**See detailed guides:**
- `QUICK_START.md` - Step-by-step setup instructions
- `GITHUB_SETUP.md` - Comprehensive GitHub integration guide

**Quick checklist:**
1. Connect local repo to GitHub (see `QUICK_START.md` Step 2)
2. Set up GitHub Secrets (see `QUICK_START.md` Step 4)
3. Configure Encore authentication (see `QUICK_START.md` Step 5)
4. Set up Supabase locally (see `QUICK_START.md` Step 6)

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Fill in your Supabase credentials in .env
# Note: For local development, you can use placeholder values
```

### 2. Start Supabase

```bash
# Start local Supabase instance
supabase start

# Apply the schema
supabase db reset

# Or apply schema manually:
psql $(supabase db url) < supabase/schema.sql
```

### 3. Start Encore Backend

```bash
# Navigate to engine directory
cd apps/engine

# Start Encore development server
encore run
```

### 4. Start Next.js Frontend

```bash
# In a new terminal, navigate to web directory
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Encore API**: http://localhost:4000
- **Supabase Studio**: http://localhost:54323

## Demo Features

Station 15 includes demo features that can be toggled via environment variables:

### Feature Flags

Set these in your `.env` file:

```bash
# Enable demo cycle simulation (30-day advance)
FEATURE_DEMO_SIM=true

# Enable shared secret authentication (bypasses JWT)
FEATURE_FAKE_AUTH=true
```

### Demo Data

When `FEATURE_FAKE_AUTH=true`, you can authenticate using:

```
Authorization: Bearer your-engine-shared-secret
```

### Demo Flow

1. **Dashboard** (`/`): View business metrics and recent activity
2. **Admin Panel** (`/admin`): Manage businesses, rules, decisions, and audit logs
3. **Rule Updates**: Modify underwriting rules in the admin panel
4. **Cycle Simulation**: Use "Advance Cycle" to simulate 30 days of business activity

## User UI Screens

**Purpose:** Give users a calm, confident sense that they are in control of time.

- **Dashboard** (`/`) – Aggregate balances, cash-flow line, quick actions
- **Checking** (`/checking`) – Transaction feed + heatmap
- **Charge Card** (`/charge-card`) – Entry product (20% avg balance); limit adapts per cycle
- **Flex Loan / AP Mgmt** (`/flex`) – Net-term slider → 'Days Gained.'
- **Transfers / Sweeps** (`/transfers`) – Visualize internal flows
- **Perks / Commons** (`/perks`) – Placeholder for benefits

## Admin UI Modules

**Purpose:** Operational truth layer — pure function, no ornament.

- **Business List** – Sortable records with balance and risk tier
- **Live Metrics Panel** – Liquidity, Recurring %, Volatility, Cycle Count
- **Decision Output** – Limits, terms, APR band, reason codes
- **Rules Manager** – Edit thresholds → instant recalc
- **Cycle Simulator** – Advance time / Stress events
- **Profile Drill-Down** – Charts + event log
- **Audit / Compliance** – Model Card snapshot, exports
- **Setup Wizard** – Create mock businesses fast

## Underwriting Logic (v0)

**Charge Card Limit:**
```
Charge Card Limit = min(0.20 × avg_balance_30d, policy_cap, 0.5 × peak_inflow)
```

**Flex Eligibility:**
```
Flex Eligibility = (cycles≥3) AND (on_time≥0.95) AND (recurring≥0.65) AND (liquidity≥1.1)
```

**Flex Limit:**
```
Flex Limit = expected_receipts × (1 – haircut(volatility, delay))
```

**Weekly Review:**
- if avg_balance < 0.8 × prior → limit –30%
- if liquidity < 1.0 → freeze flex
- if delay > 20 days → shorten term

## Data Generation

Generate synthetic data using the Python script:

```bash
cd scripts
python3 generate_data.py
```

This creates `generated_data.json` with sample transactions, invoices, and rules configuration.

## API Endpoints

All endpoints are under `/v1` and support JSON request/response.

### Authentication

Include in headers:
```
Authorization: Bearer <supabase-jwt-or-shared-secret>
```

### Endpoints

#### POST `/v1/evaluate`
Evaluate business for underwriting decision.

**Request:**
```json
{
  "business_id": "business-uuid",
  "input": {
    "revenue": 100000,
    "credit_score": 750
  },
  "idempotency_key": "optional-unique-key"
}
```

**Response:**
```json
{
  "decision": {
    "id": "decision-uuid",
    "decision_type": "underwrite",
    "decision": {"approved": true, "limit": 50000},
    "reason_codes": ["credit_score_good"],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "rule_events": [...]
}
```

#### POST `/v1/advanceCycle`
Advance business cycle (demo feature).

**Request:**
```json
{
  "business_id": "business-uuid",
  "days": 30,
  "idempotency_key": "optional-unique-key"
}
```

#### POST `/v1/rules/update` (Admin only)
Update underwriting rules.

**Request:**
```json
{
  "rules": {
    "creditLimitMultiplier": 2.5,
    "riskThresholds": {"low": 0.3, "medium": 0.6}
  },
  "effective_at": "2024-01-01T00:00:00Z"
}
```

#### GET `/v1/business/:id`
Get business metrics for UI.

**Response:**
```json
{
  "business": {...},
  "recent_transactions": [...],
  "upcoming_invoices": [...],
  "last_decision": {...},
  "utilization_percentage": 25.0
}
```

### Health Checks

- `GET /healthz`: Basic health check
- `GET /readiness`: Database connectivity check

## Database Schema

### Key Tables

- **`orgs`**: Organizations (tenancy root)
- **`org_users`**: User-organization relationships with roles
- **`businesses`**: Business accounts with limits and state
- **`transactions`**: Financial transactions
- **`invoices`**: Outstanding invoices
- **`rules_config`**: Versioned rule configurations
- **`decisions`**: Underwriting decisions with snapshots
- **`rule_events`**: Detailed rule evaluation audit trail

### Row Level Security

All tables include `org_id` for multi-tenancy and RLS policies ensure:
- Users can only access data from their organization
- Admin role required for sensitive operations
- Business role limited to read-only operations

## Development

### Adding New Rules

1. Update the `RulesConfig` type in `domain/types.go`
2. Implement evaluation logic in `domain/rules/evaluator.go`
3. Add rule events for auditability

### Database Migrations

```bash
# Reset and reapply schema
supabase db reset

# Or create new migration
supabase migration new your_migration_name
```

### Testing

```bash
# Run Encore tests
cd apps/engine && encore test

# Run Next.js tests
cd apps/web && npm test
```

## Deployment

### Encore Deployment

```bash
encore deploy
```

### Next.js Deployment

```bash
cd apps/web
npm run build
npm run start
```

### Supabase Deployment

```bash
supabase db push
```

## Architecture Decisions

### Ports & Adapters (Hexagonal)

- **Domain**: Pure business logic (`domain/`)
- **Adapters**: External dependencies (`adapters/`)
  - `db`: Database operations (currently Supabase)
  - `auth`: Authentication (currently Supabase JWT)
  - `events`: Event publishing (currently Encore pub/sub)

### Future-Proofing

- Adapters are swappable interfaces
- Feature flags control demo functionality
- Versioned APIs with clear contracts
- Comprehensive audit trails

### Security

- JWT-based authentication with organization scoping
- Row Level Security on all data access
- Input validation and sanitization
- Idempotency keys prevent duplicate operations

## Contributing

1. Follow the established architecture patterns
2. Add tests for new functionality
3. Update documentation
4. Ensure feature flags for demo features

## License

This project is part of the Station 15 MVP demonstration.
