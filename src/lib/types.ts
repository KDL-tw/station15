// Shared DTOs between Next.js UI and Encore API
// UI contract: Next.js calls Encore only

export interface Business {
  id: string;
  name: string;
  sector?: string; // PRD: sector
  balance: number; // PRD: balance
  recurringPct: number; // PRD: recurring_pct (0-100)
  volatility: number; // PRD: volatility
  chargeLimit: number;
  currentBalance: number;
  flexState: Record<string, any>;
  cycleCount?: number;
  onTimeRate?: number;
  liquidity?: number;
}

export interface BusinessMetrics {
  business: Business;
  recentTransactions: Transaction[];
  upcomingInvoices: Invoice[];
  lastDecision?: Decision;
  utilizationPercentage: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string; // PRD: type ('inflow', 'outflow', 'recurring', etc.)
  description?: string;
  date: string; // PRD: date
  transactionDate: string;
}

export interface Invoice {
  id: string;
  customerId: string; // PRD: customer_id
  amount: number;
  dueDate: string; // PRD: due_date
  paidDate?: string; // PRD: paid_date
  paid: boolean;
}

export interface Decision {
  id: string;
  decisionType: 'underwrite' | 'reunderwrite';
  limit?: number; // PRD: limit
  term?: number; // PRD: term (days)
  reason?: string; // PRD: reason
  reasonCodes: string[];
  aprBand?: string; // APR band for admin UI
  decision: Record<string, any>;
  createdAt: string;
}

export interface RuleEvent {
  id: string;
  ruleId: string; // PRD: rule_id
  ruleName: string;
  trigger: Record<string, any>; // PRD: trigger
  beforeState?: Record<string, any>; // PRD: before
  afterState?: Record<string, any>; // PRD: after
  triggerDetail: Record<string, any>;
  outcome: string;
  timestamp: string; // PRD: timestamp
  createdAt: string;
}

export interface RulesConfig {
  id: string;
  version: number;
  rules: Record<string, any>;
  effectiveAt: string;
  createdBy: string;
}

// API Request/Response types
export interface EvaluateRequest {
  businessId: string;
  input: Record<string, any>;
  idempotencyKey?: string;
}

export interface EvaluateResponse {
  decision: Decision;
  ruleEvents: RuleEvent[];
}

export interface AdvanceCycleRequest {
  businessId: string;
  days?: number;
  idempotencyKey?: string;
}

export interface AdvanceCycleResponse {
  success: boolean;
  simulatedDays: number;
}

export interface UpdateRulesRequest {
  rules: Record<string, any>;
  effectiveAt?: string;
}

export interface UpdateRulesResponse {
  rulesConfig: RulesConfig;
}

export interface ModelCard {
  id: string;
  version: string; // PRD: version
  inputs: Record<string, any>; // PRD: inputs
  outputs: Record<string, any>; // PRD: outputs
  fairness?: Record<string, any>; // PRD: fairness
  createdAt: string;
}
