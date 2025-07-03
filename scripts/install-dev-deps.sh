#!/bin/bash
# Install dev dependencies required for linting and testing
set -e

declare -a deps=(
  "@eslint/js"
  "globals"
  "eslint-plugin-react-hooks"
  "eslint-plugin-react-refresh"
  "typescript-eslint"
)

if [ -f yarn.lock ]; then
  echo "Installing dev dependencies with yarn..."
  yarn add -D "${deps[@]}"
else
  echo "Installing dev dependencies with npm..."
  npm install -D "${deps[@]}"
fi

echo "Dev dependencies installed."
