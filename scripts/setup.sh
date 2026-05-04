#!/usr/bin/env bash
set -euo pipefail

echo "==> Checking Node.js version..."
node_version=$(node -v 2>/dev/null | sed 's/v//' || echo "0")
required="20"
if [ "$(echo "$node_version" | cut -d. -f1)" -lt "$required" ]; then
  echo "ERROR: Node.js $required+ is required (found $node_version)"
  echo "Install via https://nodejs.org or use nvm: nvm install $required && nvm use $required"
  exit 1
fi
echo "    Node.js $node_version — ok"

echo "==> Installing dependencies..."
npm ci

echo "==> Copying environment file..."
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "    Created .env.local — fill in your credentials before starting the app."
else
  echo "    .env.local already exists — skipping."
fi

echo ""
echo "Setup complete. Next steps:"
echo "  1. Edit .env.local with your Clerk credentials (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)"
echo "  2. Run: npm run dev:setup  (starts Postgres via Docker + runs migrations)"
echo "  3. Run: npm run dev"
echo "  4. Open: http://localhost:3000"
