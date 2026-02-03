package config

import (
	"github.com/spf13/cobra"
)

func NewConfigCmd() *cobra.Command {
	configCmd := &cobra.Command{
		Use:     "config",
		Short:   "Manage CLI configuration",
		Aliases: []string{"cfg"},
	}

	// Add subcommands
	configCmd.AddCommand(NewSetCmd())
	configCmd.AddCommand(NewShowCmd())

	return configCmd
}
