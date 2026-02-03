package project

import (
	"github.com/spf13/cobra"
)

func NewProjectCmd() *cobra.Command {
	projectCmd := &cobra.Command{
		Use:     "project",
		Short:   "Manage projects",
		Aliases: []string{"proj", "p"},
	}

	// Add subcommands
	projectCmd.AddCommand(NewCreateCmd())
	projectCmd.AddCommand(NewListCmd())
	projectCmd.AddCommand(NewShowCmd())
	projectCmd.AddCommand(NewUpdateCmd())
	projectCmd.AddCommand(NewDeleteCmd())

	return projectCmd
}
