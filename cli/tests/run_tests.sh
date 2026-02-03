#!/bin/bash

# GBoard CLI Test Runner

echo "🧪 Running GBoard CLI tests..."
echo "================================="

# Run unit tests
echo "Running unit tests..."
go test ./tests/unit/... -v
UNIT_EXIT_CODE=$?

if [ $UNIT_EXIT_CODE -ne 0 ]; then
    echo "❌ Unit tests failed with exit code $UNIT_EXIT_CODE"
    exit $UNIT_EXIT_CODE
fi

# Run integration tests (if any)
if [ -d "tests/integration" ]; then
    echo "Running integration tests..."
    go test ./tests/integration/... -v
    INTEGRATION_EXIT_CODE=$?
    
    if [ $INTEGRATION_EXIT_CODE -ne 0 ]; then
        echo "❌ Integration tests failed with exit code $INTEGRATION_EXIT_CODE"
        exit $INTEGRATION_EXIT_CODE
    fi
else
    echo "No integration tests found, skipping..."
fi

echo "================================="
echo "✅ All tests passed successfully!"
