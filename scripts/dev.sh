#!/bin/bash

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Source environment variables from .env.development
# This makes them available for both shell commands and docker-compose interpolation
set -a
source .env.development
set +a

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Starting Neon Local proxy..."
docker compose -f docker-compose.dev.yml up -d neon-local

echo "⏳ Waiting for the database to be ready (timeout in 60s)..."
# Wait for the healthcheck to pass with a timeout
MAX_RETRIES=60
RETRY_COUNT=0
while [ "$(docker inspect -f '{{.State.Health.Status}}' neon-local)" != "healthy" ]; do
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Error: Database failed to become healthy in time."
        docker compose -f docker-compose.dev.yml logs neon-local
        exit 1
    fi
    sleep 1
    ((RETRY_COUNT++))
done

echo "✅ Database is ready!"

# Run migrations with Drizzle
echo "📜 Applying latest schema with Drizzle..."
# We run this locally since the app container isn't started yet, 
# but we need to ensure local env has the right DATABASE_URL for localhost
DATABASE_URL=postgres://neon:npg@localhost:5432/neondb?sslmode=require 

npm run db:migrate

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:3000"
echo "   Database: localhost:5432"
echo ""
echo "To stop the environment, run: docker compose -f docker-compose.dev.yml down"

# Start the application
echo "🚀 Starting application..."
docker compose -f docker-compose.dev.yml up --build app