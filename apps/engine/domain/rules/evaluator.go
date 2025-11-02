package rules

import (
	"context"
	"encore.app/station15-engine/domain"
	"math"
)

// RulesEvaluator handles rule evaluation logic
type RulesEvaluator interface {
	EvaluateRules(ctx context.Context, input map[string]interface{}, rules map[string]interface{}, business *domain.Business) (*domain.Decision, []domain.RuleEvent, error)
}

// V0Evaluator implements PRD v0 underwriting logic
type V0Evaluator struct{}

func NewSimpleEvaluator() RulesEvaluator {
	return &V0Evaluator{}
}

func (e *V0Evaluator) EvaluateRules(ctx context.Context, input map[string]interface{}, rules map[string]interface{}, business *domain.Business) (*domain.Decision, []domain.RuleEvent, error) {
	var ruleEvents []domain.RuleEvent
	var reasonCodes []string

	// Extract input values (fallback to business defaults)
	avgBalance30d := business.Balance
	peakInflow := business.Balance * 1.5 // Simplified - would come from transaction history
	policyCap := 100000.0 // Default policy cap
	if cap, ok := input["policy_cap"].(float64); ok {
		policyCap = cap
	}

	// PRD v0 Formula 1: Charge Card Limit
	// Charge Card Limit = min(0.20 × avg_balance_30d, policy_cap, 0.5 × peak_inflow)
	chargeCardLimit := math.Min(
		0.20*avgBalance30d,
		math.Min(policyCap, 0.5*peakInflow),
	)

	ruleEvents = append(ruleEvents, domain.RuleEvent{
		RuleID:   "charge_card_limit_v0",
		RuleName: "Charge Card Limit Calculation",
		Trigger: map[string]interface{}{
			"avg_balance_30d": avgBalance30d,
			"policy_cap":      policyCap,
			"peak_inflow":     peakInflow,
		},
		BeforeState: map[string]interface{}{"limit": business.ChargeLimit},
		AfterState:  map[string]interface{}{"limit": chargeCardLimit},
		Outcome:     "calculated",
	})

	reasonCodes = append(reasonCodes, "charge_card_limit_calculated")

	// PRD v0 Formula 2: Flex Eligibility
	// Flex Eligibility = (cycles≥3) AND (on_time≥0.95) AND (recurring≥0.65) AND (liquidity≥1.1)
	flexEligible := business.CycleCount >= 3 &&
		business.OnTimeRate >= 0.95 &&
		business.RecurringPct >= 65.0 &&
		business.Liquidity >= 1.1

	ruleEvents = append(ruleEvents, domain.RuleEvent{
		RuleID:   "flex_eligibility_v0",
		RuleName: "Flex Eligibility Check",
		Trigger: map[string]interface{}{
			"cycles":    business.CycleCount,
			"on_time":   business.OnTimeRate,
			"recurring": business.RecurringPct,
			"liquidity": business.Liquidity,
		},
		BeforeState: map[string]interface{}{"eligible": false},
		AfterState:  map[string]interface{}{"eligible": flexEligible},
		Outcome:     map[bool]string{true: "passed", false: "failed"}[flexEligible],
	})

	if flexEligible {
		reasonCodes = append(reasonCodes, "flex_eligible")
	} else {
		reasonCodes = append(reasonCodes, "flex_not_eligible")
	}

	// PRD v0 Formula 3: Flex Limit (if eligible)
	var flexLimit *float64
	if flexEligible {
		expectedReceipts := business.Balance * (business.RecurringPct / 100.0) // Simplified
		volatilityHaircut := calculateVolatilityHaircut(business.Volatility, 0) // delay=0 for now
		flexLimitVal := expectedReceipts * (1 - volatilityHaircut)
		flexLimit = &flexLimitVal

		ruleEvents = append(ruleEvents, domain.RuleEvent{
			RuleID:   "flex_limit_v0",
			RuleName: "Flex Limit Calculation",
			Trigger: map[string]interface{}{
				"expected_receipts": expectedReceipts,
				"volatility":        business.Volatility,
				"haircut":           volatilityHaircut,
			},
			AfterState: map[string]interface{}{"flex_limit": flexLimitVal},
			Outcome:    "calculated",
		})
	}

	// PRD v0 Weekly Review adjustments
	var weeklyAdjustments []string
	if avgBalance30d < 0.8*business.Balance {
		chargeCardLimit *= 0.7 // -30%
		weeklyAdjustments = append(weeklyAdjustments, "limit_reduced_30pct_balance_drop")
		reasonCodes = append(reasonCodes, "weekly_review_balance_drop")
	}

	if business.Liquidity < 1.0 {
		flexLimit = nil // Freeze flex
		weeklyAdjustments = append(weeklyAdjustments, "flex_frozen_liquidity")
		reasonCodes = append(reasonCodes, "weekly_review_liquidity_low")
	}

	// Calculate term (default 30 days, can be shortened)
	term := 30
	if len(weeklyAdjustments) > 0 {
		term = 20 // Shorten term if issues detected
	}

	// Build decision
	decision := &domain.Decision{
		DecisionType: "underwrite",
		Limit:        &chargeCardLimit,
		Term:         &term,
		Reason:       stringPtr(buildReason(reasonCodes)),
		ReasonCodes:  reasonCodes,
		Decision: map[string]interface{}{
			"approved":        true,
			"charge_limit":   chargeCardLimit,
			"flex_eligible":  flexEligible,
			"flex_limit":     flexLimit,
			"adjustments":    weeklyAdjustments,
		},
	}

	return decision, ruleEvents, nil
}

// calculateVolatilityHaircut implements the volatility haircut formula
// Volatility haircut ≈ 35% (from PRD), adjusted based on volatility
func calculateVolatilityHaircut(volatility, delay float64) float64 {
	baseHaircut := 0.35
	volatilityAdjustment := math.Min(volatility/100.0, 0.2) // Cap at 20% additional
	delayAdjustment := math.Min(delay/100.0, 0.15)           // Cap at 15% additional
	return math.Min(baseHaircut+volatilityAdjustment+delayAdjustment, 0.50) // Max 50%
}

func buildReason(codes []string) string {
	if len(codes) == 0 {
		return "Standard underwriting evaluation"
	}
	reason := "Underwriting decision based on: " + codes[0]
	for i := 1; i < len(codes); i++ {
		reason += ", " + codes[i]
	}
	return reason
}

func stringPtr(s string) *string {
	return &s
}
