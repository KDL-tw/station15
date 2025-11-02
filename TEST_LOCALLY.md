# Test Station 15 Locally - FREE!

This guide helps you test everything locally without using any cloud credits.

## What Works Locally

- ✅ Encore backend (API endpoints)
- ✅ Next.js frontend (UI)
- ✅ Stub/mock data (no database needed for basic testing)
- ✅ All API endpoints
- ✅ Admin and User UIs

## Quick Start

### Terminal 1: Start Encore Backend

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"
encore run
```

**You should see:**
- "API base URL: http://localhost:4000"
- List of available endpoints
- Keep this running!

### Terminal 2: Start Next.js Frontend

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web

# Create minimal .env.local (uses stub data)
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=stub-key-for-local-testing
NEXT_PUBLIC_ENCORE_API_URL=http://localhost:4000
EOF

npm run dev
```

**You should see:**
- "Ready on http://localhost:3000"
- Keep this running!

## Access Your App

- **User Dashboard:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Encore API:** http://localhost:4000
- **API Health Check:** http://localhost:4000/healthz
- **API Docs:** http://localhost:4000 (shows all endpoints)

## Test API Endpoints

### Health Check
```bash
curl http://localhost:4000/healthz
```

### Business Metrics (example)
```bash
curl http://localhost:4000/v1/business/demo-business-1
```

### Test Evaluate Endpoint
```bash
curl -X POST http://localhost:4000/v1/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer local-dev-secret-key-12345" \
  -d '{
    "business_id": "demo-business-1",
    "input": {"test": true}
  }'
```

## What You're Testing

- **Stub Database Adapter:** Returns mock data (no real database)
- **Stub Auth Adapter:** Allows demo authentication
- **Stub Events Adapter:** Logs events but doesn't publish
- **All endpoints work:** But use mock data

## Stop Services

Press `Ctrl+C` in each terminal to stop.

## Next Steps (Optional)

Once you've tested locally and everything works:
- Deploy to Encore cloud (uses credits)
- Connect to real Supabase (if you set one up)
- Add real authentication

## Troubleshooting

**"encore: command not found"**
```bash
export PATH="$HOME/.encore/bin:$PATH"
# Or restart terminal (already added to ~/.zshrc)
```

**Port 4000 already in use**
- Stop other services on port 4000
- Or Encore will automatically use a different port

**Port 3000 already in use**
- Next.js will ask if you want to use a different port
- Type "Y" and use the new port

---

**This is completely FREE - no credits used!** 🎉

