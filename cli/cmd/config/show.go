package config

import (
	"github.com/spf13/cobra"
)

func NewShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "show",
		Short:   "Show current configuration",
		Aliases: []string{"get"},
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement show functionality
			cmd.Printf("Show command not yet implemented\n")
			return nil
		},
	}
}
