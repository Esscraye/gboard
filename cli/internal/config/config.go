package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type Config struct {
	API struct {
		URL    string `mapstructure:"url"`
		Token  string `mapstructure:"token"`
		Timeout string `mapstructure:"timeout"`
		Retries int    `mapstructure:"retries"`
	} `mapstructure:"api"`
	Output struct {
		Format string `mapstructure:"format"`
		Color  bool   `mapstructure:"color"`
	} `mapstructure:"output"`
	DefaultProject string `mapstructure:"default_project"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")

	// Add config paths
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("failed to get user home directory: %w", err)
	}
	viper.AddConfigPath(filepath.Join(homeDir, ".gboard"))
	viper.AddConfigPath(".")

	// Set defaults
	viper.SetDefault("api.timeout", "30s")
	viper.SetDefault("api.retries", 3)
	viper.SetDefault("output.format", "table")
	viper.SetDefault("output.color", true)

	// Bind environment variables
	viper.AutomaticEnv()
	viper.SetEnvPrefix("GBOARD")
	viper.BindEnv("api.url", "GBOARD_API_URL")
	viper.BindEnv("api.token", "GBOARD_API_TOKEN")

	// Read config file
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("failed to read config file: %w", err)
		}
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return &config, nil
}
