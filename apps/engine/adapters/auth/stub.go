package auth

import (
	"context"
	"fmt"
)

// StubAdapter is a placeholder implementation for development
type StubAdapter struct{}

func (s *StubAdapter) VerifyToken(ctx context.Context, token string) (string, error) {
	// For demo purposes, accept any token and return a user ID
	if token == "" {
		return "", fmt.Errorf("empty token")
	}
	return "demo-user", nil
}

func (s *StubAdapter) VerifyOrgAccess(ctx context.Context, userID, orgID string) error {
	// Allow all access for demo
	return nil
}

func (s *StubAdapter) IsUserAdmin(ctx context.Context, userID, orgID string) (bool, error) {
	// Demo user is admin
	return userID == "admin-user", nil
}

func (s *StubAdapter) VerifySharedSecret(ctx context.Context, secret string) (string, error) {
	// TODO: implement shared secret verification
	return "demo-user", nil
}
