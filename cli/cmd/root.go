package cmd

import (
	"github.com/spf13/cobra"
	"github.com/tonsorg/gboard/cli/cmd/config"
	"github.com/tonsorg/gboard/cli/cmd/project"
)

func NewRootCmd() *cobra.Command {
	rootCmd := &cobra.Command{
		Use:           "gboard",
		Short:         "GBoard CLI - Manage your Kanban projects from the command line",
		Long:          `GBoard CLI allows you to manage projects, issues, and columns directly from your terminal.`,
		SilenceUsage:  true,
		SilenceErrors: true,
	}

	// Add subcommands
	rootCmd.AddCommand(project.NewProjectCmd())
	rootCmd.AddCommand(config.NewConfigCmd())

	// Add version flag
	rootCmd.PersistentFlags().BoolP("version", "v", false, "Print version information")

	return rootCmd
}
