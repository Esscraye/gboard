package project

import (
	"github.com/spf13/cobra"
)

func NewDeleteCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "delete [id]",
		Short:   "Delete a project",
		Aliases: []string{"rm", "remove"},
		Args:    cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement delete functionality
			cmd.Printf("Delete command not yet implemented for project %s\n", args[0])
			return nil
		},
	}
}
