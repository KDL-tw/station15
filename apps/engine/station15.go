// Station 15 Underwriting Engine
//encore:service
package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strconv"
	"time"

	"encore.app/station15-engine/adapters/auth"
	"encore.app/station15-engine/adapters/db"
	"encore.app/station15-engine/adapters/events"
	"encore.app/station15-engine/domain"
	"encore.app/station15-engine/domain/cycle"
	"encore.app/station15-engine/domain/rules"
	"encore.app/station15-engine/domain/underwriting"
	rulesPkg "encore.app/station15-engine/domain/rules"
)

var (
	// Feature flags
	featureDemoSim   = getEnvBool("FEATURE_DEMO_SIM", false)
	featureFakeAuth  = getEnvBool("FEATURE_FAKE_AUTH", false)
	engineSharedSecret = os.Getenv("ENGINE_SHARED_SECRET")

	// Service dependencies
	authAdapter    auth.AuthAdapter
	dbAdapter      db.DatabaseAdapter
	eventsAdapter  events.EventsAdapter
	underwritingSvc underwriting.Service
	rulesSvc       rules.Service
	cycleSvc       cycle.Service
)

// init initializes service dependencies
func init() {
	// Initialize adapters (placeholder implementations for now)
	authAdapter = &auth.StubAdapter{}
	dbAdapter = &db.StubAdapter{}
	eventsAdapter = &events.StubAdapter{}

	// Initialize domain services
	rulesEvaluator := rulesPkg.NewSimpleEvaluator()
	underwritingSvc = underwriting.NewService(rulesEvaluator, dbAdapter, eventsAdapter)
	rulesSvc = rules.NewService(dbAdapter)
	cycleSvc = cycle.NewService(dbAdapter)
}

// Helper functions
func getEnvBool(key string, defaultValue bool) bool {
	if val := os.Getenv(key); val != "" {
		if b, err := strconv.ParseBool(val); err == nil {
			return b
		}
	}
	return defaultValue
}

func generateID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func getRequestID(ctx context.Context) string {
	// TODO: Extract from middleware
	return generateID()
}

//encore:api public method=POST path=/v1/evaluate
func Evaluate(ctx context.Context, req *domain.EvaluateRequest) (*domain.EvaluateResponse, error) {
	// Authenticate and authorize
	userID, orgID, err := authenticateAndAuthorize(ctx)
	if err != nil {
		return nil, fmt.Errorf("authentication failed: %w", err)
	}

	// Check idempotency
	if req.IdempotencyKey != nil {
		if existing, err := dbAdapter.GetDecisionByIdempotencyKey(ctx, orgID, *req.IdempotencyKey); err == nil && existing != nil {
			// Return existing decision
			ruleEvents := []domain.RuleEvent{} // TODO: fetch rule events
			return &domain.EvaluateResponse{
				Decision:   *existing,
				RuleEvents: ruleEvents,
			}, nil
		}
	}

	// Evaluate business
	resp, err := underwritingSvc.Evaluate(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("evaluation failed: %w", err)
	}

	return resp, nil
}

//encore:api public method=POST path=/v1/advanceCycle
func AdvanceCycle(ctx context.Context, req *domain.AdvanceCycleRequest) (*domain.AdvanceCycleResponse, error) {
	// Authenticate and authorize
	userID, orgID, err := authenticateAndAuthorize(ctx)
	if err != nil {
		return nil, fmt.Errorf("authentication failed: %w", err)
	}

	// Check idempotency (placeholder)
	if req.IdempotencyKey != nil {
		// TODO: implement idempotency check
	}

	days := 30 // default
	if req.Days != nil {
		days = *req.Days
	}

	// Only allow demo simulation if feature flag is on
	if !featureDemoSim && days != 30 {
		return nil, fmt.Errorf("cycle advancement only available in demo mode")
	}

	err = cycleSvc.AdvanceCycle(ctx, req.BusinessID, days)
	if err != nil {
		return nil, fmt.Errorf("cycle advancement failed: %w", err)
	}

	return &domain.AdvanceCycleResponse{
		Success:       true,
		SimulatedDays: days,
	}, nil
}

//encore:api public method=POST path=/v1/rules/update
func UpdateRules(ctx context.Context, req *domain.UpdateRulesRequest) (*domain.UpdateRulesResponse, error) {
	// Authenticate and authorize (admin only)
	userID, orgID, err := authenticateAndAuthorize(ctx)
	if err != nil {
		return nil, fmt.Errorf("authentication failed: %w", err)
	}

	isAdmin, err := authAdapter.IsUserAdmin(ctx, userID, orgID)
	if err != nil {
		return nil, fmt.Errorf("authorization check failed: %w", err)
	}
	if !isAdmin {
		return nil, fmt.Errorf("admin access required")
	}

	resp, err := rulesSvc.UpdateRules(ctx, req, orgID, userID)
	if err != nil {
		return nil, fmt.Errorf("rules update failed: %w", err)
	}

	return resp, nil
}

//encore:api public method=GET path=/v1/business/:businessID
func GetBusiness(ctx context.Context, businessID string) (*domain.BusinessMetrics, error) {
	// Authenticate and authorize
	userID, orgID, err := authenticateAndAuthorize(ctx)
	if err != nil {
		return nil, fmt.Errorf("authentication failed: %w", err)
	}

	metrics, err := cycleSvc.GetBusinessMetrics(ctx, businessID)
	if err != nil {
		return nil, fmt.Errorf("failed to get business metrics: %w", err)
	}

	return metrics, nil
}

//encore:api public method=GET path=/healthz
func Healthz(ctx context.Context) error {
	return nil
}

//encore:api public method=GET path=/readiness
func Readiness(ctx context.Context) error {
	// TODO: check database connectivity
	return nil
}

// Authentication and authorization helper
func authenticateAndAuthorize(ctx context.Context) (userID, orgID string, err error) {
	// TODO: Extract token from Authorization header
	// For now, allow shared secret if FEATURE_FAKE_AUTH is enabled

	authHeader := "" // TODO: get from context

	if featureFakeAuth && authHeader == "Bearer "+engineSharedSecret {
		// Fake auth for demo
		userID = "demo-user"
		orgID = "demo-org"
		return userID, orgID, nil
	}

	// Real JWT auth
	userID, err = authAdapter.VerifyToken(ctx, authHeader)
	if err != nil {
		return "", "", fmt.Errorf("token verification failed: %w", err)
	}

	orgID, err = dbAdapter.GetUserOrgID(ctx, userID)
	if err != nil {
		return "", "", fmt.Errorf("failed to get user org: %w", err)
	}

	err = authAdapter.VerifyOrgAccess(ctx, userID, orgID)
	if err != nil {
		return "", "", fmt.Errorf("org access verification failed: %w", err)
	}

	return userID, orgID, nil
}
