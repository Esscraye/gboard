package database

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

var defaultConfig = Config{
	Host:     "localhost",
	Port:     5432,
	User:     "postgres",
	Password: "postgres",
	DBName:   "gboard",
	SSLMode:  "disable",
}

func InitDB() (*gorm.DB, error) {
	// Try to get config from environment variables first
	host := getEnv("DB_HOST", defaultConfig.Host)
	port := getEnvInt("DB_PORT", defaultConfig.Port)
	user := getEnv("DB_USER", defaultConfig.User)
	password := getEnv("DB_PASSWORD", defaultConfig.Password)
	dbname := getEnv("DB_NAME", defaultConfig.DBName)
	sslmode := getEnv("DB_SSLMODE", defaultConfig.SSLMode)

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		host,
		port,
		user,
		password,
		dbname,
		sslmode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Successfully connected to database")
	return db, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}