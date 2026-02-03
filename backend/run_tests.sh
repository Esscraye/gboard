#!/bin/bash

# This script runs all the tests for the GBoard backend.
# The `...` pattern ensures that Go searches for tests in all subdirectories.
# The `-v` flag enables verbose output, showing the status of each test.
# The `-tags "tests"` flag includes files with the "tests" build tag.

echo "🧪 Running all GBoard tests..."
go test -tags "tests unitaires" ./tests/unit/ -v
go test -tags "tests d'intégration" ./tests/integration/ -v
echo "✅ All tests completed."
