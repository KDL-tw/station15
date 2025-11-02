package events

import (
	"context"
	"encore.app/station15-engine/domain"
)

// StubAdapter is a placeholder implementation for development
type StubAdapter struct{}

func (s *StubAdapter) PublishDecisionMade(ctx context.Context, decision *domain.Decision) error {
	// TODO: implement event publishing
	return nil
}

func (s *StubAdapter) PublishRuleEvaluated(ctx context.Context, event *domain.RuleEvent) error {
	// TODO: implement event publishing
	return nil
}

func (s *StubAdapter) PublishBusinessStateChanged(ctx context.Context, business *domain.Business) error {
	// TODO: implement event publishing
	return nil
}
