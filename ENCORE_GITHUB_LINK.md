# Linking Encore to GitHub - Simple Guide

## Good News!

You don't need to "link" Encore to GitHub manually - **GitHub Actions handles it automatically!**

The workflow we created (`.github/workflows/deploy.yml`) uses an Encore API key to deploy. Here's how it works:

## How It Works

1. **Your code is on GitHub** ✅ (already done: https://github.com/KDL-tw/station15)
2. **GitHub Actions workflow** ✅ (already configured: `.github/workflows/deploy.yml`)
3. **Encore API Key** ⏳ (needs to be added to GitHub Secrets)
4. **Auto-deploys on push** ✅ (will work once API key is set)

## Step-by-Step Setup

### Step 1: Authenticate with Encore Locally

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"
encore auth login
```

This opens your browser - just sign in to your existing Encore account.

### Step 2: Get Your Encore API Key

Once authenticated, get your API key:

**Option A: Via Encore Dashboard (Easiest)**
1. Go to: https://encore.dev/dash
2. Sign in to your account
3. Go to **Account Settings** → **API Keys**
4. Click **"Create API Key"**
5. Name it: "Station 15 GitHub Actions"
6. **Copy the key** (starts with `enc_` or similar)
7. Keep it safe - you won't see it again!

**Option B: Via Encore CLI**
```bash
# After authenticating
encore auth print-key
```

### Step 3: Add API Key to GitHub Secrets

1. Go to your GitHub repository: https://github.com/KDL-tw/station15
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `ENCORE_API_KEY`
5. Value: Paste your Encore API key (from Step 2)
6. Click **"Add secret"**

### Step 4: Test It!

Once the secret is added:

1. **Push any change** to your `main` branch, OR
2. Go to **Actions** tab → **Deploy Station 15** → **"Run workflow"**

The workflow will:
- Build your Next.js app
- Deploy Encore backend automatically
- Show you the deployment URL

## No "Manual Linking" Needed!

Encore doesn't require a "link" like connecting accounts. Instead:
- ✅ GitHub Actions workflow (already configured)
- ✅ Encore API Key (add to GitHub Secrets)
- ✅ That's it! Auto-deploys work

## What About Encore Dashboard?

If you see "Link GitHub" in the Encore dashboard, that's optional and mainly for:
- Viewing deployments in Encore dashboard
- Seeing GitHub commits linked to deployments
- Optional features

**You don't need it for auto-deployment** - GitHub Actions works independently!

## Verify Everything is Set Up

### Check 1: Encore Authentication
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"
encore auth whoami
```

Should show your Encore username/email.

### Check 2: GitHub Workflow
- Go to: https://github.com/KDL-tw/station15/actions
- You should see "Deploy Station 15" workflow

### Check 3: GitHub Secret
- Go to: https://github.com/KDL-tw/station15/settings/secrets/actions
- Should see `ENCORE_API_KEY` listed

## Troubleshooting

**"Not authenticated" error:**
```bash
encore auth login
```

**Workflow fails with "authentication failed":**
- Check `ENCORE_API_KEY` secret is set correctly
- Verify API key is valid (create a new one if needed)
- Make sure key has deployment permissions

**Can't find API Keys in dashboard:**
- Make sure you're logged in to https://encore.dev/dash
- Check Account Settings → API Keys
- If not visible, try creating one via CLI first

## Quick Summary

1. ✅ Code on GitHub (done)
2. ✅ GitHub Actions workflow (done)
3. ⏳ Authenticate Encore locally: `encore auth login`
4. ⏳ Get Encore API key: https://encore.dev/dash → API Keys
5. ⏳ Add to GitHub Secrets: `ENCORE_API_KEY`
6. ✅ Auto-deploy works!

---

**Next Step:** Run `encore auth login` to authenticate, then we'll get your API key!

