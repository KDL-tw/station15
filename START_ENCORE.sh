#!/bin/bash
# Quick script to start Encore development

cd "$(dirname "$0")/apps/engine"

# Add Encore to PATH
export PATH="$HOME/.encore/bin:$PATH"

echo "🚀 Station 15 - Encore Setup"
echo "============================"
echo ""

# Check if authenticated
if encore auth whoami > /dev/null 2>&1; then
    echo "✅ Authenticated with Encore"
    encore auth whoami
else
    echo "⚠️  Not authenticated. Run: encore auth login"
    echo ""
    read -p "Do you want to authenticate now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        encore auth login
    else
        echo "Run 'encore auth login' to authenticate"
        exit 1
    fi
fi

echo ""
echo "📦 Downloading Go dependencies..."
go mod download

echo ""
echo "🔍 Checking secrets..."
encore secret list

echo ""
read -p "Ready to run locally (FREE)? This will start at http://localhost:4000 (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting Encore (press Ctrl+C to stop)..."
    echo ""
    encore run
else
    echo ""
    echo "To deploy to cloud (uses credits), run:"
    echo "  encore deploy --env=dev"
fi

