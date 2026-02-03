package project

import (
	"github.com/spf13/cobra"
)

func NewUpdateCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "update [id]",
		Short:   "Update a project",
		Aliases: []string{"edit"},
		Args:    cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement update functionality
			cmd.Printf("Update command not yet implemented for project %s\n", args[0])
			return nil
		},
	}
}
