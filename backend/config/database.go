package config

import (
	"fmt"
	"log"
	"os"

	"gboard-backend/internal/repositories"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDatabase() (*repositories.Repository, error) {
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "postgres"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "gboard"
	}

	dbSSLMode := os.Getenv("DB_SSLMODE")
	if dbSSLMode == "" {
		dbSSLMode = "disable"
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	// Add UTF-8 encoding parameter to DSN
	dsn += " application_name=gboard client_encoding=UTF8"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Auto-migrate all models
	repo := repositories.NewRepository(db)
	if err := repo.AutoMigrate(); err != nil {
		return nil, fmt.Errorf("failed to auto-migrate models: %v", err)
	}

	log.Println("Database connection established and models migrated")
	return repo, nil
}