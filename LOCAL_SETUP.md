# Local Development Setup Guide

This guide helps you run Station 15 locally before deploying to Encore cloud (saving credits!).

## Prerequisites Installation

### 1. Install Supabase CLI

```bash
# macOS (using Homebrew)
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

### 2. Install Encore CLI

```bash
# Install Encore
curl -L https://encore.dev/install.sh | bash

# Add to your PATH (add this line to ~/.zshrc or ~/.bashrc)
export PATH="$HOME/.encore/bin:$PATH"

# Reload your shell
source ~/.zshrc  # or source ~/.bashrc

# Verify installation
encore version
```

## Step-by-Step Local Setup

### Step 1: Initialize Supabase Locally

```bash
cd /Users/klanier/Desktop/Station15/station15

# Initialize Supabase (first time only)
supabase init

# Start Supabase local instance
supabase start
```

**This will:**
- Start a local PostgreSQL database
- Start local Supabase services
- Show you connection details

**Save the output!** You'll need:
- `API URL` (usually `http://localhost:54321`)
- `anon key` (for Next.js)
- `service_role key` (for Encore backend)

### Step 2: Apply Database Schema

```bash
# Apply the schema to local database
supabase db reset
```

This applies `supabase/schema.sql` to your local database.

### Step 3: Set Up Environment Variables

**For Next.js (apps/web/.env.local):**

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key-from-step-1>
EOF
```

Replace `<paste-anon-key-from-step-1>` with the anon key from `supabase start` output.

**For Encore (apps/engine/.encore.env):**

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Create .encore.env file
cat > .encore.env << EOF
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE=<paste-service-role-key-from-step-1>
FEATURE_DEMO_SIM=true
FEATURE_FAKE_AUTH=true
ENGINE_SHARED_SECRET=local-dev-secret-key-12345
EOF
```

Replace `<paste-service-role-key-from-step-1>` with the service_role key from `supabase start` output.

### Step 4: Install Dependencies

**Next.js:**
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web
npm install
```

**Encore (Go):**
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
go mod download
```

## Running the Application Locally

You'll need **3 terminal windows**:

### Terminal 1: Supabase

```bash
cd /Users/klanier/Desktop/Station15/station15
supabase start
# Keep this running - shows local Supabase status
```

### Terminal 2: Encore Backend

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
encore run
```

This will:
- Start Encore backend at `http://localhost:4000`
- Show API endpoints
- Enable hot-reload on code changes

### Terminal 3: Next.js Frontend

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web
npm run dev
```

This will:
- Start Next.js at `http://localhost:3000`
- Enable hot-reload on code changes

## Accessing the Application

- **Frontend (User UI):** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Encore API:** http://localhost:4000
- **Encore Dashboard:** http://localhost:4000 (shows API docs)
- **Supabase Studio:** http://localhost:54323 (database management)

## Testing the Application

1. **Visit:** http://localhost:3000
   - You should see the Station 15 dashboard
   - Brand colors (Indigo/Crimson) should be visible

2. **Visit:** http://localhost:3000/admin
   - Admin interface with gray grid layout
   - Should show business list, metrics, etc.

3. **Test API:** http://localhost:4000
   - Should show Encore API documentation
   - Health check: http://localhost:4000/healthz

## Troubleshooting

### "supabase: command not found"
- Install Supabase CLI: `brew install supabase/tap/supabase`

### "encore: command not found"
- Install Encore CLI: `curl -L https://encore.dev/install.sh | bash`
- Add to PATH: `export PATH="$HOME/.encore/bin:$PATH"`

### Port already in use
- Supabase uses: 54321 (API), 54322 (DB), 54323 (Studio)
- Encore uses: 4000
- Next.js uses: 3000
- Check what's using ports: `lsof -i :3000` or `lsof -i :4000`

### Database connection errors
- Make sure Supabase is running: `supabase status`
- Check environment variables match `supabase start` output
- Verify schema was applied: `supabase db reset`

### Next.js build errors
- Make sure `.env.local` has correct Supabase URL and keys
- Check that Supabase is running first

## Stopping Services

To stop everything:

```bash
# Stop Supabase
supabase stop

# Stop Encore (Ctrl+C in Terminal 2)

# Stop Next.js (Ctrl+C in Terminal 3)
```

## Next: Once Local Works

Once everything runs locally and you've tested it:

1. ✅ Verify all pages load
2. ✅ Test API endpoints work
3. ✅ Check data flows correctly
4. Then proceed to cloud deployment (when ready)

This way you test everything locally before spending Encore credits!

