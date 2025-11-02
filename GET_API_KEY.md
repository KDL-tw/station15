# Get Your Encore API Key for GitHub

## ✅ You're Authenticated!

You're now logged in to Encore. Now we need to get your API key for GitHub Actions.

## Two Ways to Get Your API Key

### Method 1: Encore Dashboard (Recommended)

1. **Go to:** https://encore.dev/dash
2. **Sign in** (if not already)
3. **Click your profile** (top right) → **Account Settings**
4. **Click "API Keys"** in the sidebar
5. **Click "Create API Key"**
6. **Name it:** `Station 15 GitHub Actions`
7. **Copy the key** (looks like `enc_live_...` or similar)
8. ⚠️ **Save it immediately** - you won't see it again!

### Method 2: Encore CLI

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"

# This will show your API key
encore auth print-key
```

## Add to GitHub Secrets

Once you have your API key:

1. **Go to:** https://github.com/KDL-tw/station15/settings/secrets/actions
2. **Click "New repository secret"**
3. **Name:** `ENCORE_API_KEY`
4. **Value:** Paste your Encore API key
5. **Click "Add secret"**

## That's It!

**No "linking" needed!** Here's how it works:

- ✅ GitHub Actions workflow (already configured)
- ✅ Uses `ENCORE_API_KEY` from GitHub Secrets
- ✅ Auto-deploys when you push to `main`

The workflow (`.github/workflows/deploy.yml`) uses the API key to authenticate and deploy - no account linking required!

## Test It

After adding the secret:

1. **Make a small change** and push to `main`, OR
2. **Go to:** https://github.com/KDL-tw/station15/actions
3. **Click "Deploy Station 15"** → **"Run workflow"**

The workflow will deploy your Encore backend automatically!

## Quick Steps Summary

1. ✅ Authenticated with Encore (done!)
2. ⏳ Get API key: https://encore.dev/dash → Account Settings → API Keys
3. ⏳ Add to GitHub: https://github.com/KDL-tw/station15/settings/secrets/actions
4. ✅ Auto-deploy will work!

---

**Go get your API key from the dashboard now!**

