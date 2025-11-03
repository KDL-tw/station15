#!/bin/bash
# Start Station 15 locally

echo "🚀 Starting Station 15..."
echo ""

cd "$(dirname "$0")"

echo "📦 Starting Next.js frontend..."
echo ""

npm run dev

echo ""
echo "✅ Station 15 should be running!"
echo "👉 Open: http://localhost:3000 (or whatever port is shown above)"

