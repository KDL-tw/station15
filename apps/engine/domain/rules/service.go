package rules

import (
	"context"
	"encore.app/station15-engine/domain"
)

// Service handles rules configuration management
type Service interface {
	// Update rules configuration
	UpdateRules(ctx context.Context, req *domain.UpdateRulesRequest, orgID, userID string) (*domain.UpdateRulesResponse, error)

	// Get current rules for organization
	GetCurrentRules(ctx context.Context, orgID string) (*domain.RulesConfig, error)
}

// service implements the rules Service interface
type service struct {
	dbAdapter DatabaseAdapter
}

// NewService creates a new rules service
func NewService(dbAdapter DatabaseAdapter) Service {
	return &service{
		dbAdapter: dbAdapter,
	}
}

// DatabaseAdapter dependency injection interface
type DatabaseAdapter interface {
	GetCurrentRules(ctx context.Context, orgID string) (*domain.RulesConfig, error)
	CreateRulesVersion(ctx context.Context, rules *domain.RulesConfig) error
}
