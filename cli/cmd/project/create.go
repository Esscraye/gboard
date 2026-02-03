package project

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/spf13/cobra"
	"github.com/tonsorg/gboard/cli/internal/api"
	"github.com/tonsorg/gboard/cli/internal/config"
	"github.com/tonsorg/gboard/backend/graph/model"
)

type CreateOptions struct {
	Name        string
	Description string
}

func NewCreateCmd() *cobra.Command {
	opts := &CreateOptions{}

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new project",
		RunE: func(cmd *cobra.Command, args []string) error {
			return runCreate(cmd, opts)
		},
	}

	cmd.Flags().StringVarP(&opts.Name, "name", "n", "", "Project name (required)")
	cmd.Flags().StringVarP(&opts.Description, "description", "d", "", "Project description")
	cmd.MarkFlagRequired("name")

	return cmd
}

func runCreate(cmd *cobra.Command, opts *CreateOptions) error {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	// Create API client
	apiClient, err := api.NewClient(cfg.API.URL, cfg.API.Token)
	if err != nil {
		return fmt.Errorf("failed to create API client: %w", err)
	}

	// Create project via API
	input := model.NewProject{
		Name:        opts.Name,
		Description: opts.Description,
	}

	project, err := apiClient.CreateProject(context.Background(), input)
	if err != nil {
		return fmt.Errorf("failed to create project: %w", err)
	}

	// Output result based on configured format
	return outputProject(project, cfg.Output.Format)
}

func outputProject(project *model.Project, format string) error {
	switch format {
	case "json":
		data, err := json.MarshalIndent(project, "", "  ")
		if err != nil {
			return err
		}
		fmt.Println(string(data))
	case "yaml":
		// Would need to import yaml package
		fmt.Printf("YAML output not yet implemented\n")
		fallthrough
	default: // table
		fmt.Printf("ID: %s\n", project.ID)
		fmt.Printf("Name: %s\n", project.Name)
		fmt.Printf("Description: %s\n", project.Description)
		fmt.Printf("Created: %s\n", project.CreatedAt)
	}
	return nil
}
