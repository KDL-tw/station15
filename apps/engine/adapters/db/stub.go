package db

import (
	"context"
	"encore.app/station15-engine/domain"
	"time"
)

// StubAdapter is a placeholder implementation for development
type StubAdapter struct{}

func (s *StubAdapter) GetOrgByID(ctx context.Context, orgID string) (*domain.Organization, error) {
	return &domain.Organization{
		ID:        orgID,
		Name:      "Demo Organization",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (s *StubAdapter) GetUserOrgID(ctx context.Context, userID string) (string, error) {
	return "demo-org", nil
}

func (s *StubAdapter) IsUserAdmin(ctx context.Context, userID, orgID string) (bool, error) {
	return userID == "admin-user", nil
}

func (s *StubAdapter) GetBusiness(ctx context.Context, businessID string) (*domain.Business, error) {
	return &domain.Business{
		ID:             businessID,
		OrgID:          "demo-org",
		Name:           "Demo Business",
		ChargeLimit:    50000,
		CurrentBalance: 12500,
		FlexState:      map[string]interface{}{"riskLevel": "low"},
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}, nil
}

func (s *StubAdapter) UpdateBusiness(ctx context.Context, business *domain.Business) error {
	return nil
}

func (s *StubAdapter) ListBusinesses(ctx context.Context, orgID string) ([]domain.Business, error) {
	return []domain.Business{
		{
			ID:             "business-1",
			OrgID:          orgID,
			Name:           "TechCorp Inc",
			ChargeLimit:    100000,
			CurrentBalance: 25000,
			FlexState:      map[string]interface{}{"riskLevel": "medium"},
		},
	}, nil
}

func (s *StubAdapter) GetRecentTransactions(ctx context.Context, businessID string, limit int) ([]domain.Transaction, error) {
	return []domain.Transaction{
		{
			ID:              "tx-1",
			OrgID:           "demo-org",
			BusinessID:      businessID,
			Amount:          -2500,
			Description:     stringPtr("Office supplies"),
			TransactionDate: time.Now().AddDate(0, 0, -2),
			CreatedAt:       time.Now(),
		},
	}, nil
}

func (s *StubAdapter) CreateTransaction(ctx context.Context, tx *domain.Transaction) error {
	return nil
}

func (s *StubAdapter) GetUpcomingInvoices(ctx context.Context, businessID string) ([]domain.Invoice, error) {
	return []domain.Invoice{
		{
			ID:         "inv-1",
			OrgID:      "demo-org",
			BusinessID: businessID,
			Amount:     3500,
			DueDate:    time.Now().AddDate(0, 0, 12),
			Paid:       false,
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		},
	}, nil
}

func (s *StubAdapter) CreateInvoice(ctx context.Context, invoice *domain.Invoice) error {
	return nil
}

func (s *StubAdapter) GetCurrentRules(ctx context.Context, orgID string) (*domain.RulesConfig, error) {
	return &domain.RulesConfig{
		ID:      "rules-1",
		OrgID:   orgID,
		Version: 1,
		Rules: map[string]interface{}{
			"creditLimitMultiplier": 2.5,
			"riskThresholds": map[string]interface{}{
				"low":    0.3,
				"medium": 0.6,
				"high":   0.8,
			},
		},
		EffectiveAt: time.Now(),
		CreatedBy:   "admin-user",
		CreatedAt:   time.Now(),
	}, nil
}

func (s *StubAdapter) CreateRulesVersion(ctx context.Context, rules *domain.RulesConfig) error {
	return nil
}

func (s *StubAdapter) CreateDecision(ctx context.Context, decision *domain.Decision) error {
	return nil
}

func (s *StubAdapter) GetDecisionByIdempotencyKey(ctx context.Context, orgID, key string) (*domain.Decision, error) {
	return nil, nil // No existing decision
}

func (s *StubAdapter) GetLastDecision(ctx context.Context, businessID string) (*domain.Decision, error) {
	return &domain.Decision{
		ID:           "decision-1",
		OrgID:        "demo-org",
		BusinessID:   businessID,
		DecisionType: "underwrite",
		Decision:     map[string]interface{}{"approved": true, "limit": 50000},
		ReasonCodes:  []string{"credit_score_good"},
		CreatedAt:    time.Now(),
	}, nil
}

func (s *StubAdapter) CreateRuleEvents(ctx context.Context, events []domain.RuleEvent) error {
	return nil
}

func (s *StubAdapter) GetBusinessMetrics(ctx context.Context, businessID string) (*domain.BusinessMetrics, error) {
	business, _ := s.GetBusiness(ctx, businessID)
	transactions, _ := s.GetRecentTransactions(ctx, businessID, 5)
	invoices, _ := s.GetUpcomingInvoices(ctx, businessID)
	lastDecision, _ := s.GetLastDecision(ctx, businessID)

	utilization := (business.CurrentBalance / business.ChargeLimit) * 100

	return &domain.BusinessMetrics{
		Business:             *business,
		RecentTransactions:   transactions,
		UpcomingInvoices:     invoices,
		LastDecision:         lastDecision,
		UtilizationPercentage: utilization,
	}, nil
}

func stringPtr(s string) *string {
	return &s
}
