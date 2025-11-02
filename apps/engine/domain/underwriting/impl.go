package underwriting

import (
	"context"
	"encore.app/station15-engine/domain"
	"time"
)

func (s *service) Evaluate(ctx context.Context, req *domain.EvaluateRequest) (*domain.EvaluateResponse, error) {
	// Get business
	business, err := s.dbAdapter.GetBusiness(ctx, req.BusinessID)
	if err != nil {
		return nil, err
	}

	// Get current rules
	rules, err := s.dbAdapter.GetCurrentRules(ctx, business.OrgID)
	if err != nil {
		return nil, err
	}

	// Evaluate rules
	decision, ruleEvents, err := s.rulesService.EvaluateRules(ctx, req.Input, rules.Rules, business)
	if err != nil {
		return nil, err
	}

	// Set decision metadata
	decision.ID = generateID()
	decision.OrgID = business.OrgID
	decision.BusinessID = req.BusinessID
	decision.DecisionType = "underwrite"
	decision.InputSnapshot = req.Input
	decision.RulesSnapshot = rules.Rules
	decision.IdempotencyKey = req.IdempotencyKey
	decision.CreatedAt = time.Now()

	// Set rule event metadata
	for i := range ruleEvents {
		ruleEvents[i].ID = generateID()
		ruleEvents[i].OrgID = business.OrgID
		ruleEvents[i].DecisionID = decision.ID
		ruleEvents[i].CreatedAt = time.Now()
	}

	// Save decision and rule events
	err = s.dbAdapter.CreateDecision(ctx, decision)
	if err != nil {
		return nil, err
	}

	err = s.dbAdapter.CreateRuleEvents(ctx, ruleEvents)
	if err != nil {
		return nil, err
	}

	// Publish events
	s.eventsAdapter.PublishDecisionMade(ctx, decision)
	for _, event := range ruleEvents {
		s.eventsAdapter.PublishRuleEvaluated(ctx, &event)
	}

	return &domain.EvaluateResponse{
		Decision:   *decision,
		RuleEvents: ruleEvents,
	}, nil
}

func (s *service) AdvanceCycle(ctx context.Context, req *domain.AdvanceCycleRequest) (*domain.AdvanceCycleResponse, error) {
	// TODO: Implement cycle advancement logic
	return &domain.AdvanceCycleResponse{
		Success:       true,
		SimulatedDays: 30,
	}, nil
}

// TODO: implement generateID function or import from utils
func generateID() string {
	return "generated-id"
}
