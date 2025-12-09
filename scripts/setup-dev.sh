#!/bin/bash

# Development Environment Setup Script

set -e

echo "Setting up Clubbasse.pl development environment..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Warning: Docker is not installed. Docker is recommended for local development."
fi

# Create .env file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "✓ .env.local created. Please update with your local values."
fi

# Install root dependencies
echo ""
echo "Installing dependencies..."
npm install

# Install frontend dependencies
if [ -d "src/frontend" ]; then
    echo "Installing frontend dependencies..."
    cd src/frontend
    npm install
    cd ../..
fi

# Install backend dependencies
if [ -d "src/backend" ]; then
    echo "Installing backend dependencies..."
    cd src/backend
    npm install
    cd ../..
fi

# Setup Git hooks (if using husky)
if [ -f "package.json" ] && grep -q "husky" package.json; then
    echo "Setting up Git hooks..."
    npm run prepare || true
fi

echo ""
echo "✓ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Start Docker services: docker-compose -f docker/docker-compose.yml up -d"
echo "3. Run database migrations (if applicable)"
echo "4. Start development servers:"
echo "   - Frontend: cd src/frontend && npm run dev"
echo "   - Backend: cd src/backend && npm run dev"
echo ""
