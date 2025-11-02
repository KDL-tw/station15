-- Station 15 (S15) Database Schema
-- Multi-tenant underwriting platform with auditability and feature flags

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schema
CREATE SCHEMA IF NOT EXISTS s15;
SET search_path TO s15;

-- Organizations table (multi-tenancy root)
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization users (RBAC: admin vs business)
CREATE TABLE org_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Supabase auth.users.id
    role TEXT NOT NULL CHECK (role IN ('admin', 'business')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);

-- Businesses table (PRD: id, sector, balance, recurring_pct, volatility)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sector TEXT,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    recurring_pct DECIMAL(5,2) DEFAULT 0, -- Percentage of recurring revenue (0-100)
    volatility DECIMAL(5,2) DEFAULT 0, -- Volatility measure
    charge_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
    current_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    flex_state JSONB DEFAULT '{}',
    cycle_count INTEGER DEFAULT 0, -- Number of cycles completed
    on_time_rate DECIMAL(5,2) DEFAULT 1.0, -- On-time payment rate (0-1)
    liquidity DECIMAL(12,2) DEFAULT 0, -- Liquidity ratio
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table (PRD: business_id, date, amount, type)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    type TEXT NOT NULL, -- 'inflow', 'outflow', 'recurring', 'one_time', etc.
    description TEXT,
    date DATE NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Alias for date
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table (PRD: customer_id, due_date, paid_date, amount)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rules configuration (versioned)
CREATE TABLE rules_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    rules JSONB NOT NULL,
    effective_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL, -- org_users.id
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, version)
);

-- Decisions table (PRD: business_id, limit, term, reason)
-- Also includes snapshots for auditability
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    decision_type TEXT NOT NULL CHECK (decision_type IN ('underwrite', 'reunderwrite')),
    limit_amount DECIMAL(12,2), -- PRD: limit
    term INTEGER, -- PRD: term (in days)
    reason TEXT, -- PRD: reason
    reason_codes TEXT[] DEFAULT '{}', -- Additional reason codes
    apr_band TEXT, -- APR band for admin UI
    input_snapshot JSONB NOT NULL,
    rules_snapshot JSONB NOT NULL,
    decision JSONB NOT NULL,
    idempotency_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, idempotency_key)
);

-- Rule events table (PRD: rule_id, trigger, before, after, timestamp)
CREATE TABLE rule_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
    rule_id TEXT NOT NULL, -- PRD: rule_id
    rule_name TEXT NOT NULL,
    trigger JSONB NOT NULL, -- PRD: trigger
    before_state JSONB, -- PRD: before
    after_state JSONB, -- PRD: after
    trigger_detail JSONB NOT NULL, -- Additional details
    outcome TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- PRD: timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_org_users_org_id ON org_users(org_id);
CREATE INDEX idx_org_users_user_id ON org_users(user_id);
CREATE INDEX idx_businesses_org_id ON businesses(org_id);
CREATE INDEX idx_transactions_org_id ON transactions(org_id);
CREATE INDEX idx_transactions_business_id ON transactions(business_id);
CREATE INDEX idx_invoices_org_id ON invoices(org_id);
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
CREATE INDEX idx_rules_config_org_id ON rules_config(org_id);
CREATE INDEX idx_decisions_org_id ON decisions(org_id);
CREATE INDEX idx_decisions_business_id ON decisions(business_id);
CREATE INDEX idx_decisions_idempotency_key ON decisions(org_id, idempotency_key);
CREATE INDEX idx_rule_events_org_id ON rule_events(org_id);
CREATE INDEX idx_rule_events_decision_id ON rule_events(decision_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Model Card table (PRD: version, inputs, outputs, fairness)
CREATE TABLE model_card (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    inputs JSONB NOT NULL,
    outputs JSONB NOT NULL,
    fairness JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, version)
);

CREATE INDEX idx_model_card_org_id ON model_card(org_id);
ALTER TABLE model_card ENABLE ROW LEVEL SECURITY;

CREATE POLICY model_card_select ON model_card FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY model_card_insert ON model_card FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));

-- Row Level Security (RLS) Policies
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_events ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's org_id
CREATE OR REPLACE FUNCTION s15.get_user_org_id(user_uuid UUID)
RETURNS UUID AS $$
    SELECT org_id FROM s15.org_users WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION s15.is_user_admin(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT role = 'admin'
    FROM s15.org_users
    WHERE user_id = user_uuid AND org_id = org_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Orgs policies (users can only see their own org)
CREATE POLICY orgs_select ON orgs FOR SELECT
    USING (id = s15.get_user_org_id(auth.uid()));

-- Org users policies
CREATE POLICY org_users_select ON org_users FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY org_users_insert ON org_users FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));
CREATE POLICY org_users_update ON org_users FOR UPDATE
    USING (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id))
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));

-- Businesses policies (business role users can see businesses, admins can manage)
CREATE POLICY businesses_select ON businesses FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY businesses_insert ON businesses FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));
CREATE POLICY businesses_update ON businesses FOR UPDATE
    USING (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id))
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));

-- Transactions policies (business role users can see transactions for their org)
CREATE POLICY transactions_select ON transactions FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY transactions_insert ON transactions FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()));

-- Invoices policies
CREATE POLICY invoices_select ON invoices FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY invoices_insert ON invoices FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));
CREATE POLICY invoices_update ON invoices FOR UPDATE
    USING (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id))
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));

-- Rules config policies (admin only)
CREATE POLICY rules_config_select ON rules_config FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));
CREATE POLICY rules_config_insert ON rules_config FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()) AND s15.is_user_admin(auth.uid(), org_id));

-- Decisions policies
CREATE POLICY decisions_select ON decisions FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY decisions_insert ON decisions FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()));

-- Rule events policies
CREATE POLICY rule_events_select ON rule_events FOR SELECT
    USING (org_id = s15.get_user_org_id(auth.uid()));
CREATE POLICY rule_events_insert ON rule_events FOR INSERT
    WITH CHECK (org_id = s15.get_user_org_id(auth.uid()));

-- Updated at triggers
CREATE OR REPLACE FUNCTION s15.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON orgs
    FOR EACH ROW EXECUTE FUNCTION s15.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION s15.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION s15.update_updated_at_column();
