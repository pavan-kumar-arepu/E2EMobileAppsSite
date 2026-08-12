#!/usr/bin/env bash
set -euo pipefail

# Run from repository root. This script installs, tests, builds, and serves the app.
cd "$(dirname "$0")/.."

echo "Project root: $(pwd)"

if [ -f package-lock.json ]; then
  echo "Detected package-lock.json — running npm ci"
  npm ci
else
  echo "No lockfile — running npm install"
  npm install
fi

echo "Running tests (non-interactive)..."
# run tests but do not fail the whole script if tests fail
npm test -- --watchAll=false || echo "Tests finished (exit code non-zero)"

echo "Building production bundle..."
npm run build

echo "Serving build on http://localhost:5000 (press Ctrl-C to stop)"
# Use npx serve (no global install required)
npx serve -s build -l 5000
