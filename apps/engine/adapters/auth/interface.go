package auth

import (
	"context"
)

// AuthAdapter defines the interface for authentication and authorization
// This is swappable - currently implemented with Supabase JWT
type AuthAdapter interface {
	// Verify user authentication and extract user ID
	VerifyToken(ctx context.Context, token string) (string, error)

	// Verify user has access to organization
	VerifyOrgAccess(ctx context.Context, userID, orgID string) error

	// Check if user is admin in organization
	IsUserAdmin(ctx context.Context, userID, orgID string) (bool, error)

	// Allow shared secret authentication for demo purposes
	VerifySharedSecret(ctx context.Context, secret string) (string, error)
}
