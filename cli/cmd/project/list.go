package project

import (
	"github.com/spf13/cobra"
)

func NewListCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "list",
		Short:   "List all projects",
		Aliases: []string{"ls"},
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement list functionality
			cmd.Printf("List command not yet implemented\n")
			return nil
		},
	}
}
