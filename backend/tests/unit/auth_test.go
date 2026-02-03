package unit_test

import (
	"encoding/hex"
	"testing"

	"gboard-backend/internal/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHashPassword(t *testing.T) {
	testPassword := "test123"

	hashed, err := models.HashPassword(testPassword)
	require.NoError(t, err, "HashPassword should not return error")
	assert.NotEmpty(t, hashed, "Hashed password should not be empty")

	// Encode to hex like we do in the real code
	hexHashed := hex.EncodeToString(hashed)

	// Test verification
	err = models.VerifyPassword(hexHashed, testPassword)
	require.NoError(t, err, "VerifyPassword should not return error for correct password")

	// Test wrong password
	err = models.VerifyPassword(hexHashed, "wrongpassword")
	require.Error(t, err, "VerifyPassword should return error for incorrect password")
}