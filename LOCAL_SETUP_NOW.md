# Quick Local Setup - Ready to Run!

## ✅ What's Already Installed

- ✅ Supabase CLI installed
- ✅ Encore CLI installed
- ✅ Next.js dependencies installed
- ✅ Git repository connected to GitHub

## 🐳 Step 1: Install Docker Desktop (Required)

Supabase needs Docker to run locally.

**Install Docker Desktop:**
1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and launch Docker Desktop
3. Make sure Docker Desktop is running (check the menu bar for the Docker icon)

**Or install via Homebrew:**
```bash
brew install --cask docker
```

Then open Docker Desktop from Applications.

## 🚀 Step 2: Once Docker is Running

Run this command in your terminal:

```bash
cd /Users/klanier/Desktop/Station15/station15
supabase start
```

This will:
- Download and start Docker containers
- Set up local PostgreSQL database
- Show you connection details (save these!)

**You'll see output like:**
```
API URL: http://localhost:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save these keys!** You'll need them in the next step.

## ⚙️ Step 3: Apply Database Schema

```bash
cd /Users/klanier/Desktop/Station15/station15
supabase db reset
```

This applies your schema to the local database.

## 📝 Step 4: Set Up Environment Files

**Create Next.js environment file:**

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web

# Replace <ANON_KEY> with the anon key from Step 2
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
EOF
```

**Create Encore environment file:**

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Replace <SERVICE_ROLE_KEY> with the service_role key from Step 2
cat > .encore.env << 'EOF'
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE=<SERVICE_ROLE_KEY>
FEATURE_DEMO_SIM=true
FEATURE_FAKE_AUTH=true
ENGINE_SHARED_SECRET=local-dev-secret-key-12345
EOF
```

## 🎬 Step 5: Run Everything (3 Terminals)

### Terminal 1: Supabase (Keep Running)
```bash
cd /Users/klanier/Desktop/Station15/station15
supabase start
# Leave this running - shows status
```

### Terminal 2: Encore Backend
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Load Encore path (or restart terminal)
export ENCORE_INSTALL="$HOME/.encore"
export PATH="$ENCORE_INSTALL/bin:$PATH"

# Start Encore
encore run
```

You should see:
- Encore starting at `http://localhost:4000`
- API endpoints listed

### Terminal 3: Next.js Frontend
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web
npm run dev
```

You should see:
- Next.js starting at `http://localhost:3000`

## 🌐 Access Your App

Once all three are running:

- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Encore API:** http://localhost:4000
- **Supabase Studio:** http://localhost:54323

## ✅ Test It Out

1. Visit http://localhost:3000 - Should see Station 15 dashboard
2. Visit http://localhost:3000/admin - Should see admin interface
3. Check http://localhost:4000/healthz - Should return success

## 🔧 Troubleshooting

### "Docker daemon not running"
- Install and start Docker Desktop
- Wait for it to fully start (check menu bar icon)

### "encore: command not found"
- Restart your terminal, OR
- Run: `export PATH="$HOME/.encore/bin:$PATH"`

### "Port already in use"
- Stop other services using ports 3000, 4000, or 54321
- Or change ports in configuration files

### Database connection errors
- Make sure Supabase is running: `supabase status`
- Verify environment variables match `supabase start` output

## 📚 Need More Help?

See `LOCAL_SETUP.md` for detailed instructions.

---

**Current Status:**
- ✅ Tools installed
- ⏳ Waiting for Docker Desktop
- 🚀 Ready to run once Docker is up!

