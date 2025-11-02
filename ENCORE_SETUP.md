# Encore Deployment Setup Guide

This guide helps you deploy Station 15 to Encore cloud.

## Prerequisites

- ✅ Encore CLI installed
- ✅ Encore account (sign up at https://encore.dev if needed)

## Step 1: Authenticate with Encore

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Add Encore to PATH (or restart terminal)
export PATH="$HOME/.encore/bin:$PATH"

# Authenticate
encore auth login
```

This will:
- Open your browser
- Ask you to sign in/up with Encore
- Authorize the CLI

## Step 2: Set Up Encore Secrets

Encore uses secrets for environment variables. Set these:

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Add Encore to PATH
export PATH="$HOME/.encore/bin:$PATH"

# Set each secret (will prompt for value)
encore secret set --type secret SUPABASE_URL
encore secret set --type secret SUPABASE_SERVICE_ROLE
encore secret set --type secret ENGINE_SHARED_SECRET
encore secret set --type secret FEATURE_DEMO_SIM
encore secret set --type secret FEATURE_FAKE_AUTH
```

**When prompted, enter:**
- `SUPABASE_URL`: Your Supabase project URL (cloud: `https://iodzosdpafidkvujdcxf.supabase.co`)
- `SUPABASE_SERVICE_ROLE`: From Supabase dashboard → Settings → API
- `ENGINE_SHARED_SECRET`: Generate with `openssl rand -hex 32` or use any secure string
- `FEATURE_DEMO_SIM`: `true`
- `FEATURE_FAKE_AUTH`: `true`

## Step 3: Test Locally (Optional, No Credits)

Before deploying, test locally:

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Add Encore to PATH
export PATH="$HOME/.encore/bin:$PATH"

# Run locally (no credits used)
encore run
```

This starts your API at `http://localhost:4000` - test it before deploying!

## Step 4: Deploy to Encore Cloud

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine

# Add Encore to PATH
export PATH="$HOME/.encore/bin:$PATH"

# Deploy to dev environment
encore deploy --env=dev
```

**This will:**
- Build your Go application
- Deploy to Encore cloud
- Show you the deployment URL
- Use Encore credits

**First deployment may take a few minutes** (build + upload).

## Step 5: Get Your Deployment URL

After deployment, Encore will show:
- API URL (like `https://your-app.encr.app`)
- Dashboard URL
- API documentation

## Using Cloud Supabase

If you're using Supabase cloud (instead of local):

1. **Get your Supabase connection details:**
   - Go to: https://supabase.com/dashboard/project/iodzosdpafidkvujdcxf
   - Settings → API
   - Copy:
     - Project URL
     - Service Role key

2. **Apply your database schema:**
   - Go to: Supabase Dashboard → SQL Editor
   - Paste contents of `supabase/schema.sql`
   - Run it

3. **Use these in Encore secrets:**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE`: Service Role key

## Cost Management

**Encore Free Tier:**
- Limited credits per month
- Dev environment uses credits
- Production uses more credits

**To save credits:**
- Test locally first (`encore run`) - FREE
- Only deploy when needed
- Use dev environment (cheaper than prod)

## Troubleshooting

### "encore: command not found"
```bash
export PATH="$HOME/.encore/bin:$PATH"
# Or restart terminal (added to ~/.zshrc)
```

### "Not authenticated"
```bash
encore auth login
```

### Deployment fails
- Check secrets are set: `encore secret list`
- Verify Supabase URL and keys are correct
- Check Encore dashboard for error logs

### Connection errors
- Verify Supabase URL is correct (include https://)
- Check Service Role key is valid
- Ensure Supabase project is active

## Next Steps

After deployment:
1. ✅ Test API endpoints
2. ✅ Update Next.js to point to Encore URL
3. ✅ Set up GitHub Actions (already configured!)
4. ✅ Future pushes auto-deploy

---

**Quick Command Reference:**

```bash
# Authenticate
encore auth login

# Set secrets
encore secret set --type secret SUPABASE_URL

# Test locally (FREE)
encore run

# Deploy to cloud (USES CREDITS)
encore deploy --env=dev

# View deployments
encore app list
```

