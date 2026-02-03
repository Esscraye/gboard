package project

import (
	"github.com/spf13/cobra"
)

func NewShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "show [id]",
		Short:   "Show project details",
		Aliases: []string{"get"},
		Args:    cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement show functionality
			cmd.Printf("Show command not yet implemented for project %s\n", args[0])
			return nil
		},
	}
}
