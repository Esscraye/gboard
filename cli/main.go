package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/tonsorg/gboard/cli/cmd"
)

func main() {
	rootCmd := cmd.NewRootCmd()

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
