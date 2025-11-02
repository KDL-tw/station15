package domain

import (
	"time"
)

// Core business entities
type Organization struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type OrgUser struct {
	ID       string `json:"id"`
	OrgID    string `json:"org_id"`
	UserID   string `json:"user_id"`
	Role     string `json:"role"` // "admin" or "business"
	CreatedAt time.Time `json:"created_at"`
}

type Business struct {
	ID            string                 `json:"id"`
	OrgID         string                 `json:"org_id"`
	Name          string                 `json:"name"`
	Sector        *string                `json:"sector,omitempty"`        // PRD: sector
	Balance       float64                `json:"balance"`                 // PRD: balance
	RecurringPct  float64                `json:"recurring_pct"`            // PRD: recurring_pct (0-100)
	Volatility    float64                `json:"volatility"`               // PRD: volatility
	ChargeLimit   float64                `json:"charge_limit"`
	CurrentBalance float64               `json:"current_balance"`
	FlexState     map[string]interface{} `json:"flex_state"`
	CycleCount    int                    `json:"cycle_count"`             // Number of cycles completed
	OnTimeRate    float64                `json:"on_time_rate"`            // On-time payment rate (0-1)
	Liquidity     float64                `json:"liquidity"`                // Liquidity ratio
	CreatedAt     time.Time              `json:"created_at"`
	UpdatedAt     time.Time              `json:"updated_at"`
}

type Transaction struct {
	ID             string    `json:"id"`
	OrgID          string    `json:"org_id"`
	BusinessID     string    `json:"business_id"`
	Amount         float64   `json:"amount"`
	Type           string    `json:"type"`                  // PRD: type ('inflow', 'outflow', 'recurring', etc.)
	Description    *string   `json:"description,omitempty"`
	Date           time.Time `json:"date"`                 // PRD: date
	TransactionDate time.Time `json:"transaction_date"`    // Alias for date
	CreatedAt      time.Time `json:"created_at"`
}

type Invoice struct {
	ID         string     `json:"id"`
	OrgID      string     `json:"org_id"`
	BusinessID string     `json:"business_id"`
	CustomerID string     `json:"customer_id"`             // PRD: customer_id
	Amount     float64    `json:"amount"`
	DueDate    time.Time  `json:"due_date"`                // PRD: due_date
	PaidDate   *time.Time `json:"paid_date,omitempty"`    // PRD: paid_date
	Paid       bool       `json:"paid"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

type RulesConfig struct {
	ID         string                 `json:"id"`
	OrgID      string                 `json:"org_id"`
	Version    int                    `json:"version"`
	Rules      map[string]interface{} `json:"rules"`
	EffectiveAt time.Time             `json:"effective_at"`
	CreatedBy  string                 `json:"created_by"`
	CreatedAt  time.Time              `json:"created_at"`
}

type Decision struct {
	ID             string                 `json:"id"`
	OrgID          string                 `json:"org_id"`
	BusinessID     string                 `json:"business_id"`
	DecisionType   string                 `json:"decision_type"` // "underwrite" or "reunderwrite"
	Limit          *float64               `json:"limit,omitempty"`          // PRD: limit
	Term           *int                   `json:"term,omitempty"`           // PRD: term (days)
	Reason         *string                `json:"reason,omitempty"`         // PRD: reason
	ReasonCodes    []string               `json:"reason_codes"`
	APRBand        *string                `json:"apr_band,omitempty"`       // APR band for admin UI
	InputSnapshot  map[string]interface{} `json:"input_snapshot"`
	RulesSnapshot  map[string]interface{} `json:"rules_snapshot"`
	Decision       map[string]interface{} `json:"decision"`
	IdempotencyKey *string                `json:"idempotency_key,omitempty"`
	CreatedAt      time.Time              `json:"created_at"`
}

type RuleEvent struct {
	ID           string                 `json:"id"`
	OrgID        string                 `json:"org_id"`
	DecisionID   string                 `json:"decision_id"`
	RuleID       string                 `json:"rule_id"`                    // PRD: rule_id
	RuleName     string                 `json:"rule_name"`
	Trigger      map[string]interface{} `json:"trigger"`                  // PRD: trigger
	BeforeState  map[string]interface{} `json:"before_state,omitempty"`    // PRD: before
	AfterState   map[string]interface{} `json:"after_state,omitempty"`     // PRD: after
	TriggerDetail map[string]interface{} `json:"trigger_detail"`
	Outcome      string                 `json:"outcome"`
	Timestamp    time.Time              `json:"timestamp"`                 // PRD: timestamp
	CreatedAt    time.Time              `json:"created_at"`
}

type ModelCard struct {
	ID        string                 `json:"id"`
	OrgID     string                 `json:"org_id"`
	Version   string                 `json:"version"`                  // PRD: version
	Inputs    map[string]interface{} `json:"inputs"`                   // PRD: inputs
	Outputs   map[string]interface{} `json:"outputs"`                  // PRD: outputs
	Fairness  map[string]interface{} `json:"fairness,omitempty"`        // PRD: fairness
	CreatedAt time.Time              `json:"created_at"`
}

// API request/response types
type EvaluateRequest struct {
	BusinessID     string                 `json:"business_id"`
	Input          map[string]interface{} `json:"input"`
	IdempotencyKey *string                `json:"idempotency_key,omitempty"`
}

type EvaluateResponse struct {
	Decision   Decision     `json:"decision"`
	RuleEvents []RuleEvent  `json:"rule_events"`
}

type AdvanceCycleRequest struct {
	BusinessID     string  `json:"business_id"`
	Days           *int     `json:"days,omitempty"`
	IdempotencyKey *string `json:"idempotency_key,omitempty"`
}

type AdvanceCycleResponse struct {
	Success      bool `json:"success"`
	SimulatedDays int  `json:"simulated_days"`
}

type UpdateRulesRequest struct {
	Rules       map[string]interface{} `json:"rules"`
	EffectiveAt *time.Time             `json:"effective_at,omitempty"`
}

type UpdateRulesResponse struct {
	RulesConfig RulesConfig `json:"rules_config"`
}

type BusinessMetrics struct {
	Business          Business       `json:"business"`
	RecentTransactions []Transaction `json:"recent_transactions"`
	UpcomingInvoices  []Invoice      `json:"upcoming_invoices"`
	LastDecision      *Decision      `json:"last_decision,omitempty"`
	UtilizationPercentage float64     `json:"utilization_percentage"`
}
