# Deployment Guide

## Vercel Deployment

### First Time Setup

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Add New Project**
3. **Import Git Repository**: Select `KDL-tw/station15`
4. **Framework Preset**: Next.js (auto-detected)
5. **Root Directory**: Leave empty (default - root)
6. **Deploy**

### Environment Variables

Add these in Vercel project settings → Environment Variables:

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key
```

**Optional:**
```
FEATURE_DEMO_SIM=true
FEATURE_FAKE_AUTH=true
ENGINE_SHARED_SECRET=your-secret-key
```

### Auto-Deploy

Vercel automatically deploys on every push to `main` branch.

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase credentials
npm run dev
```

## Supabase Setup

1. Create a Supabase project
2. Run the schema: Copy contents of `supabase/schema.sql` to SQL Editor
3. Get your project URL and keys from Project Settings → API
4. Add to `.env.local` or Vercel environment variables

---

**Ready to deploy!** Just import to Vercel and add your environment variables.

