package cycle

import (
	"context"
	"encore.app/station15-engine/domain"
)

// Service handles business cycle management and simulation
type Service interface {
	// Advance business cycle by specified days
	AdvanceCycle(ctx context.Context, businessID string, days int) error

	// Simulate 30 days for demo purposes
	SimulateDemoCycle(ctx context.Context, businessID string) error

	// Get business metrics for UI
	GetBusinessMetrics(ctx context.Context, businessID string) (*domain.BusinessMetrics, error)
}

// service implements the cycle Service interface
type service struct {
	dbAdapter DatabaseAdapter
}

// NewService creates a new cycle service
func NewService(dbAdapter DatabaseAdapter) Service {
	return &service{
		dbAdapter: dbAdapter,
	}
}

// DatabaseAdapter dependency injection interface
type DatabaseAdapter interface {
	GetBusiness(ctx context.Context, businessID string) (*domain.Business, error)
	GetRecentTransactions(ctx context.Context, businessID string, limit int) ([]domain.Transaction, error)
	GetUpcomingInvoices(ctx context.Context, businessID string) ([]domain.Invoice, error)
	GetLastDecision(ctx context.Context, businessID string) (*domain.Decision, error)
	UpdateBusiness(ctx context.Context, business *domain.Business) error
	CreateTransaction(ctx context.Context, tx *domain.Transaction) error
	CreateInvoice(ctx context.Context, invoice *domain.Invoice) error
}

// RulesEvaluator dependency injection interface (for re-underwriting)
type RulesEvaluator interface {
	EvaluateRules(ctx context.Context, input map[string]interface{}, rules map[string]interface{}, business *domain.Business) (*domain.Decision, []domain.RuleEvent, error)
}
