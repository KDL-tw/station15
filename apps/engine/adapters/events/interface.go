package events

import (
	"context"
	"encore.app/station15-engine/domain"
)

// EventsAdapter defines the interface for event publishing
// This is swappable - currently implemented with Encore pub/sub
type EventsAdapter interface {
	// Publish decision made event
	PublishDecisionMade(ctx context.Context, decision *domain.Decision) error

	// Publish rule evaluated event
	PublishRuleEvaluated(ctx context.Context, event *domain.RuleEvent) error

	// Publish business state changed event
	PublishBusinessStateChanged(ctx context.Context, business *domain.Business) error
}
