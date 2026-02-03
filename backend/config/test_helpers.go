//go:build testing || tests

package config

import (
	"fmt"

	"gboard-backend/internal/repositories"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// InitTestDatabase sets up an in-memory SQLite database for testing purposes.
// It is included only in test builds.
func InitTestDatabase() (*repositories.Repository, error) {
	// Using ":memory:" creates a temporary, in-memory database.
	// Adding "?cache=shared" is crucial to ensure the connection is shared
	// across different calls in the same process, which is necessary for tests.
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to test database: %w", err)
	}

	// Create a new repository
	repo := repositories.NewRepository(db)

	// Auto-migrate the database schema
	if err := repo.AutoMigrate(); err != nil {
		// Attempt to close the database connection on failure
		sqlDB, _ := db.DB()
		sqlDB.Close()
		return nil, fmt.Errorf("failed to auto-migrate models for test database: %w", err)
	}

	return repo, nil
}
