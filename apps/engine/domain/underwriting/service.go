package underwriting

import (
	"context"
	"encore.app/station15-engine/domain"
)

// Service handles underwriting decisions
type Service interface {
	// Evaluate business for underwriting decision
	Evaluate(ctx context.Context, req *domain.EvaluateRequest) (*domain.EvaluateResponse, error)

	// Advance business cycle (simulate time progression)
	AdvanceCycle(ctx context.Context, req *domain.AdvanceCycleRequest) (*domain.AdvanceCycleResponse, error)
}

// service implements the underwriting Service interface
type service struct {
	rulesService RulesEvaluator
	dbAdapter    DatabaseAdapter
	eventsAdapter EventsAdapter
}

// NewService creates a new underwriting service
func NewService(rulesService RulesEvaluator, dbAdapter DatabaseAdapter, eventsAdapter EventsAdapter) Service {
	return &service{
		rulesService: rulesService,
		dbAdapter:    dbAdapter,
		eventsAdapter: eventsAdapter,
	}
}

// DatabaseAdapter dependency injection interface
type DatabaseAdapter interface {
	GetBusiness(ctx context.Context, businessID string) (*domain.Business, error)
	GetCurrentRules(ctx context.Context, orgID string) (*domain.RulesConfig, error)
	CreateDecision(ctx context.Context, decision *domain.Decision) error
	GetDecisionByIdempotencyKey(ctx context.Context, orgID, key string) (*domain.Decision, error)
	CreateRuleEvents(ctx context.Context, events []domain.RuleEvent) error
	UpdateBusiness(ctx context.Context, business *domain.Business) error
}

// RulesEvaluator dependency injection interface
type RulesEvaluator interface {
	EvaluateRules(ctx context.Context, input map[string]interface{}, rules map[string]interface{}, business *domain.Business) (*domain.Decision, []domain.RuleEvent, error)
}

// EventsAdapter dependency injection interface
type EventsAdapter interface {
	PublishDecisionMade(ctx context.Context, decision *domain.Decision) error
	PublishRuleEvaluated(ctx context.Context, event *domain.RuleEvent) error
	PublishBusinessStateChanged(ctx context.Context, business *domain.Business) error
}
