package config

import (
	"github.com/spf13/cobra"
)

func NewSetCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "set [key] [value]",
		Short:   "Set a configuration value",
		Args:    cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement set functionality
			cmd.Printf("Set command not yet implemented for %s=%s\n", args[0], args[1])
			return nil
		},
	}
}
