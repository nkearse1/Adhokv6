#!/bin/bash
# Bootstrap development environment
set -e

echo "Installing dependencies with yarn..."
yarn install

if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo "Copied .env.example to .env"
fi

echo "Setup complete."
