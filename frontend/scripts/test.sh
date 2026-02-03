#!/bin/bash

echo "🚀 Starting Playwright tests..."

# Run tests with video recording and screenshots
echo "📹 Running tests with video recording..."
bunx playwright test

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
    echo "📊 Generating HTML report..."
    
    # Generate HTML report
    bunx playwright show-report
    
    echo "📁 Test artifacts location:"
    echo "  - HTML Report: playwright-report/index.html"
    echo "  - Videos: test-results/"
    echo "  - Screenshots: test-results/"
    echo "  - Traces: test-results/"
else
    echo "❌ Some tests failed!"
    echo "📊 Generating HTML report for failed tests..."
    
    # Generate HTML report even if tests failed
    bunx playwright show-report
    
    echo "📁 Test artifacts location (check for failures):"
    echo "  - HTML Report: playwright-report/index.html"
    echo "  - Videos: test-results/"
    echo "  - Screenshots: test-results/"
    echo "  - Traces: test-results/"
    
    exit 1
fi