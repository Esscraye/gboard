package unit_test

import (
	"testing"

	"gboard-backend/internal/models"
	"gboard-backend/pkg/auth"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestJWTGenerationAndValidation(t *testing.T) {
	// Create a test user
	testUser := &models.User{
		BaseModel: models.BaseModel{ID: "test-user-id"},
		Email:     "test@example.com",
		Name:      "Test User",
		Username:  "testuser",
	}

	// Test token generation
	token, refreshToken, err := auth.GenerateToken(testUser)
	require.NoError(t, err, "GenerateToken should not return an error")
	assert.NotEmpty(t, token, "Token should not be empty")
	assert.NotEmpty(t, refreshToken, "Refresh token should not be empty")

	// Test token validation
	claims, err := auth.ValidateToken(token)
	require.NoError(t, err, "ValidateToken should not return an error for valid token")
	assert.Equal(t, testUser.ID, claims.UserID, "Token claims should contain correct user ID")

	// Test refresh token
	newToken, newRefreshToken, err := auth.RefreshToken(refreshToken)
	require.NoError(t, err, "RefreshToken should not return an error")
	assert.NotEmpty(t, newToken, "New token should not be empty")
	assert.NotEmpty(t, newRefreshToken, "New refresh token should not be empty")

	// Test invalid token validation
	_, err = auth.ValidateToken("invalid.token.here")
	require.Error(t, err, "ValidateToken should return an error for invalid token")
	assert.Equal(t, auth.ErrInvalidToken, err, "Error should be ErrInvalidToken")
}