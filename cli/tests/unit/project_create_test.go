package unit_test

import (
	"testing"
	"bytes"
	"os"

	"github.com/stretchr/testify/assert"
	"github.com/tonsorg/gboard/cli/cmd/project"
)

func TestProjectCreateCommand(t *testing.T) {
	// Save original args
	originalArgs := os.Args
	defer func() { os.Args = originalArgs }()

	tests := []struct {
		name      string
		args      []string
		wantError bool
		expectedOutput string
	}{
		{
			name:      "valid project creation",
			args:      []string{"project", "create", "--name", "Test Project", "--description", "Test Description"},
			wantError: false,
			expectedOutput: "ID:",
		},
		{
			name:      "missing required name flag",
			args:      []string{"project", "create", "--description", "Test Description"},
			wantError: true,
			expectedOutput: "required flag",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set up command
			os.Args = tt.args
			cmd := project.NewCreateCmd()

			// Capture output
			var buf bytes.Buffer
			cmd.SetOut(&buf)
			cmd.SetErr(&buf)

			// Execute command
			err := cmd.Execute()

			if tt.wantError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			if tt.expectedOutput != "" {
				assert.Contains(t, buf.String(), tt.expectedOutput)
			}
		})
	}
}
