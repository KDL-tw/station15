# Quick Start: Connect to GitHub, Encore, and Supabase

## What I've Done For You

✅ Created `.gitignore` file  
✅ Initialized git repository  
✅ Created GitHub Actions workflow  
✅ Created environment variable templates  
✅ Removed nested git repository conflicts  

## What You Need To Do

### Step 1: GitHub Repository (Already Connected!)

✅ **Your repository is already connected!**

- **GitHub URL:** https://github.com/KDL-tw/station15.git
- **Supabase Project ID:** `iodzosdpafidkvujdcxf` (for Supabase setup later)

To verify the connection:
```bash
cd /Users/klanier/Desktop/Station15/station15
git remote -v
```

### Step 2: Connect to GitHub

✅ **Already done!** Your repository is connected to:
- https://github.com/KDL-tw/station15.git

To verify:
```bash
cd /Users/klanier/Desktop/Station15/station15
git remote -v
```

You should see your GitHub URL listed.

### Step 3: Make Your First Commit

```bash
cd /Users/klanier/Desktop/Station15/station15

# Create the initial commit
git commit -m "Initial commit: Station 15 MVP with PRD compliance"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication errors:**
- Use a Personal Access Token (not password)
- Generate one: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic)
- Select scopes: `repo` (full control)
- Use the token as your password when pushing

### Step 4: Set Up GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets (one at a time):

| Secret Name | Where to Get It |
|------------|----------------|
| `ENCORE_API_KEY` | https://encore.dev/dash → Account → API Keys → Create new |
| `SUPABASE_URL` | Your Supabase project URL (cloud) or `http://localhost:54321` (local) |
| `SUPABASE_SERVICE_ROLE` | Supabase Dashboard → Settings → API → Service Role key |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as SUPABASE_URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Anon key |
| `ENGINE_SHARED_SECRET` | Generate with: `openssl rand -hex 32` |
| `FEATURE_DEMO_SIM` | Set value: `true` |
| `FEATURE_FAKE_AUTH` | Set value: `true` |

### Step 5: Set Up Encore

**First time setup:**
```bash
# Install Encore CLI (if not already installed)
curl -L https://encore.dev/install.sh | bash

# Authenticate
cd /Users/klanier/Desktop/Station15/station15/apps/engine
encore auth
```

**Set Encore secrets (for cloud deployment):**
```bash
encore secret set --type secret SUPABASE_URL
encore secret set --type secret SUPABASE_SERVICE_ROLE
encore secret set --type secret ENGINE_SHARED_SECRET
encore secret set --type secret FEATURE_DEMO_SIM
encore secret set --type secret FEATURE_FAKE_AUTH
```

When prompted, enter the values for each secret.

### Step 6: Set Up Supabase (Local)

```bash
cd /Users/klanier/Desktop/Station15/station15

# Start Supabase locally
supabase start

# Apply the schema
supabase db reset

# This will show you connection details including:
# - Postgres URL
# - API URL (use for NEXT_PUBLIC_SUPABASE_URL)
# - Anon key (use for NEXT_PUBLIC_SUPABASE_ANON_KEY)
# - Service role key (use for SUPABASE_SERVICE_ROLE)
```

### Step 7: Test Locally

**Terminal 1 - Supabase:**
```bash
cd /Users/klanier/Desktop/Station15/station15
supabase start
# Keep this running
```

**Terminal 2 - Encore:**
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Create .encore.env file with Supabase connection details
# Copy values from 'supabase start' output
encore run
```

**Terminal 3 - Next.js:**
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web

# Create .env.local file with Supabase connection details
npm run dev
```

### Step 8: Verify GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. After you push code, the workflow should run automatically
4. Check that it completes successfully

## Troubleshooting

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin <your-repo-url>
```

### "Permission denied" when pushing
- Generate Personal Access Token (see Step 3)
- Or set up SSH keys for GitHub

### Encore not found
```bash
# Install Encore
curl -L https://encore.dev/install.sh | bash

# Add to PATH (add to ~/.zshrc)
export PATH="$HOME/.encore/bin:$PATH"
```

### Supabase not found
```bash
# Install Supabase CLI
brew install supabase/tap/supabase
```

## Next Steps After Setup

1. ✅ Code is now on GitHub
2. ✅ Auto-deployment will trigger on pushes to `main`
3. ✅ You can develop locally using the commands above
4. ✅ Encore backend will deploy automatically to dev environment

For more details, see `GITHUB_SETUP.md`

