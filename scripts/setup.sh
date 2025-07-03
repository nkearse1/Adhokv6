#!/bin/bash
# Bootstrap development environment
set -e

if [ -f yarn.lock ]; then
  echo "Installing dependencies with yarn..."
  yarn install
else
  echo "Installing dependencies with npm..."
  npm install
fi

# Install additional dev dependencies needed for linting and testing
./scripts/install-dev-deps.sh

if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo "Copied .env.example to .env"
fi

echo "Setup complete."
