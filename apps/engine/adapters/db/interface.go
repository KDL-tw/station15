package db

import (
	"context"
	"encore.app/station15-engine/domain"
)

// DatabaseAdapter defines the interface for database operations
// This is swappable - currently implemented with Supabase Postgres
type DatabaseAdapter interface {
	// Organization operations
	GetOrgByID(ctx context.Context, orgID string) (*domain.Organization, error)
	GetUserOrgID(ctx context.Context, userID string) (string, error)
	IsUserAdmin(ctx context.Context, userID, orgID string) (bool, error)

	// Business operations
	GetBusiness(ctx context.Context, businessID string) (*domain.Business, error)
	UpdateBusiness(ctx context.Context, business *domain.Business) error
	ListBusinesses(ctx context.Context, orgID string) ([]domain.Business, error)

	// Transaction operations
	GetRecentTransactions(ctx context.Context, businessID string, limit int) ([]domain.Transaction, error)
	CreateTransaction(ctx context.Context, tx *domain.Transaction) error

	// Invoice operations
	GetUpcomingInvoices(ctx context.Context, businessID string) ([]domain.Invoice, error)
	CreateInvoice(ctx context.Context, invoice *domain.Invoice) error

	// Rules operations
	GetCurrentRules(ctx context.Context, orgID string) (*domain.RulesConfig, error)
	CreateRulesVersion(ctx context.Context, rules *domain.RulesConfig) error

	// Decision operations
	CreateDecision(ctx context.Context, decision *domain.Decision) error
	GetDecisionByIdempotencyKey(ctx context.Context, orgID, key string) (*domain.Decision, error)
	GetLastDecision(ctx context.Context, businessID string) (*domain.Decision, error)

	// Rule events operations
	CreateRuleEvents(ctx context.Context, events []domain.RuleEvent) error

	// Business metrics aggregation
	GetBusinessMetrics(ctx context.Context, businessID string) (*domain.BusinessMetrics, error)
}
