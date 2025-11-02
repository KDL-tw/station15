# Encore Next Steps - Ready to Go!

## ✅ Everything is Installed

- ✅ Go installed (`v1.25.3`)
- ✅ Encore CLI installed (`v1.50.7`)
- ✅ Code ready
- ✅ Script ready (`START_ENCORE.sh`)

## 🎯 What to Do Now

### Option 1: Use the Helper Script (Easiest)

```bash
cd /Users/klanier/Desktop/Station15/station15
./START_ENCORE.sh
```

This script will:
- Check if you're authenticated
- Help you authenticate if needed
- Download dependencies
- Ask if you want to run locally (FREE)

### Option 2: Manual Steps

**Step 1: Authenticate**
```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"
encore auth login
```

**Step 2: Test Locally (FREE - No Credits)**
```bash
# Still in apps/engine directory
encore run
```

This starts your API at `http://localhost:4000` - completely free!

**Step 3: Set Secrets (For Deployment)**
```bash
# Get Supabase details from: https://supabase.com/dashboard/project/iodzosdpafidkvujdcxf
# Settings → API

encore secret set --type secret SUPABASE_URL
# Paste: https://iodzosdpafidkvujdcxf.supabase.co

encore secret set --type secret SUPABASE_SERVICE_ROLE
# Paste: Your service role key

encore secret set --type secret ENGINE_SHARED_SECRET
# Run: openssl rand -hex 32 (or paste any secure string)

encore secret set --type secret FEATURE_DEMO_SIM
# Type: true

encore secret set --type secret FEATURE_FAKE_AUTH
# Type: true
```

**Step 4: Deploy to Cloud (Uses Credits)**
```bash
encore deploy --env=dev
```

## 📋 Getting Supabase Cloud Details

1. Go to: https://supabase.com/dashboard/project/iodzosdpafidkvujdcxf
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** (for `SUPABASE_URL`)
   - **service_role** key (for `SUPABASE_SERVICE_ROLE`)
4. Apply schema:
   - Go to **SQL Editor**
   - Copy contents of `supabase/schema.sql`
   - Paste and click **Run**

## 🎉 Testing Your API

Once running (locally or deployed):

- **Health check:** http://localhost:4000/healthz (or your Encore URL)
- **API docs:** http://localhost:4000 (Encore dashboard)
- **Readiness:** http://localhost:4000/readiness

## ⚡ Quick Commands

```bash
# Authenticate
encore auth login

# Test locally (FREE)
encore run

# Set secrets
encore secret set --type secret KEY_NAME

# Deploy (USES CREDITS)
encore deploy --env=dev

# View secrets
encore secret list

# Check who you're logged in as
encore auth whoami
```

## 💡 Pro Tips

1. **Test locally first** - `encore run` is completely FREE
2. **Only deploy when ready** - `encore deploy` uses credits
3. **Use dev environment** - Cheaper than production
4. **Check dashboard** - https://encore.dev/dash shows usage

## 🚀 Ready?

Run the helper script:
```bash
cd /Users/klanier/Desktop/Station15/station15
./START_ENCORE.sh
```

Or authenticate manually:
```bash
cd apps/engine
export PATH="$HOME/.encore/bin:$PATH"
encore auth login
```

Let me know when you're authenticated and I can help with the next steps!

