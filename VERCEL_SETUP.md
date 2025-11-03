# Vercel Deployment Setup

## Quick Setup

### Step 1: Connect to Vercel

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New..."** → **"Project"**
4. **Import Git Repository:**
   - Select: `KDL-tw/station15`
   - **Framework Preset:** Next.js (auto-detected)
   - **⚠️ CRITICAL:** Click **"Configure Project"** or **"Edit"**
   - **Root Directory:** Set to `apps/web` ⚠️ **THIS IS CRITICAL!**
   - Click **"Deploy"**

### Step 2: Configure Environment Variables

In Vercel project settings, add these:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Supabase anon key

3. **FEATURE_DEMO_SIM**
   - Value: `true`

4. **FEATURE_FAKE_AUTH**
   - Value: `true`

5. **ENGINE_SHARED_SECRET**
   - Generate: `openssl rand -hex 32`

6. **SUPABASE_URL** (for API routes)
   - Same as NEXT_PUBLIC_SUPABASE_URL

7. **SUPABASE_SERVICE_ROLE**
   - Supabase service role key

### Step 3: Deploy!

Click **"Deploy"** - Vercel will:
- Build your Next.js app
- Deploy API routes
- Give you a URL like: `station15.vercel.app`

### Step 4: Auto-Deploy Setup

Vercel automatically deploys when you push to `main` branch!

**Optional:** GitHub Actions can also trigger deployments (already configured).

## API Routes

Your API routes are available at:
- `https://your-app.vercel.app/api/v1/evaluate`
- `https://your-app.vercel.app/api/v1/advanceCycle`
- `https://your-app.vercel.app/api/v1/rules/update`
- `https://your-app.vercel.app/api/v1/business/:id`
- `https://your-app.vercel.app/api/healthz`

## Local Development

Run locally:
```bash
cd apps/web
npm run dev
```

API routes work the same way:
- `http://localhost:3000/api/v1/evaluate`
- etc.

## Cost

**Vercel Free Tier:**
- Free for personal projects
- Generous limits
- Perfect for MVP

**No credits to manage** - much simpler than Encore!

---

**Ready to deploy?** Just import your repo to Vercel with root directory `apps/web`!

