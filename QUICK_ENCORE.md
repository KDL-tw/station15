# Quick Encore Setup - Let's Deploy!

## ✅ What's Ready

- ✅ Encore CLI installed (`v1.50.7`)
- ✅ Encore app configured (dev environment)
- ✅ Code ready to deploy

## 🚀 Quick Start (3 Steps)

### Step 1: Authenticate with Encore

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Add Encore to PATH (or restart terminal)
export PATH="$HOME/.encore/bin:$PATH"

# Login to Encore
encore auth login
```

This opens your browser - sign in or create an account at https://encore.dev

### Step 2: Set Secrets (Need Supabase Cloud Details)

```bash
# Still in apps/engine directory
export PATH="$HOME/.encore/bin:$PATH"

# Set each secret (paste values when prompted)
encore secret set --type secret SUPABASE_URL
encore secret set --type secret SUPABASE_SERVICE_ROLE  
encore secret set --type secret ENGINE_SHARED_SECRET
encore secret set --type secret FEATURE_DEMO_SIM
encore secret set --type secret FEATURE_FAKE_AUTH
```

**You'll need:**
- **Supabase URL**: Get from Supabase dashboard (project `iodzosdpafidkvujdcxf`)
- **Supabase Service Role**: From Supabase → Settings → API
- **ENGINE_SHARED_SECRET**: Run `openssl rand -hex 32` or use any secure string
- **FEATURE_DEMO_SIM**: Just type `true`
- **FEATURE_FAKE_AUTH**: Just type `true`

### Step 3: Deploy!

```bash
# Still in apps/engine directory
export PATH="$HOME/.encore/bin:$PATH"

# Deploy to dev environment (uses credits)
encore deploy --env=dev
```

## 📋 Getting Supabase Cloud Details

If you haven't set up Supabase cloud yet:

1. **Go to:** https://supabase.com/dashboard/project/iodzosdpafidkvujdcxf
2. **Get API URL:**
   - Settings → API
   - Copy "Project URL" (looks like `https://xxxxx.supabase.co`)
3. **Get Service Role Key:**
   - Same page, copy "service_role" key (not anon key)
4. **Apply Schema:**
   - Go to SQL Editor
   - Paste contents of `supabase/schema.sql`
   - Click "Run"

## 💡 Test Locally First (FREE, No Credits)

Before deploying, test locally:

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"

# Run locally - completely FREE!
encore run
```

This starts at `http://localhost:4000` - test your API before deploying!

## ⚠️ Go Installation

If you see "go: command not found", install Go:

```bash
brew install go
```

Or Encore might handle it automatically during deployment.

## 🎯 After Deployment

Encore will show you:
- Your API URL (like `https://station15-engine-xxxxx.encr.app`)
- Dashboard URL
- API documentation

**Then:**
- Update Next.js to use your Encore API URL
- Test the endpoints
- Set up GitHub Actions to auto-deploy on push

## 🔍 Troubleshooting

**"Not authenticated"**
```bash
encore auth login
```

**"Go not found"**
```bash
brew install go
```

**Deployment fails**
- Check all secrets are set: `encore secret list`
- Verify Supabase URL includes `https://`
- Check Encore dashboard for logs

---

**Ready?** Run Step 1 (authentication) and let me know when you're logged in!

