# ✅ Switched from Encore to Vercel

## What Changed

### ✅ Removed
- **Encore Go backend** (`apps/engine/`)
- All Encore CLI and configuration files
- Encore deployment workflows
- Encore-related documentation

### ✅ Added
- **Next.js API Routes** (`apps/web/src/app/api/v1/`)
  - `/api/v1/evaluate` - Underwriting evaluation
  - `/api/v1/advanceCycle` - Cycle simulation
  - `/api/v1/rules/update` - Rules management
  - `/api/v1/business/:id` - Business metrics
  - `/api/healthz` - Health check
  - `/api/readiness` - Readiness check
- **Vercel configuration** (`vercel.json`, `apps/web/vercel.json`)
- **Updated GitHub Actions** for Vercel deployment
- **Vercel setup guide** (`VERCEL_SETUP.md`)

## Benefits

1. **Simpler architecture** - Everything in one Next.js app
2. **No credits** - Vercel free tier is generous
3. **Easier deployment** - Just connect GitHub repo
4. **Faster development** - No separate backend to manage

## Next Steps

1. **Follow `VERCEL_SETUP.md`** to deploy to Vercel
2. **Test locally** - API routes work the same as before
3. **Update environment variables** in Vercel dashboard

## Local Development

API routes work exactly as before:
```bash
cd apps/web
npm run dev
```

Access at:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/v1/evaluate

---

**Ready to deploy?** See `VERCEL_SETUP.md` for step-by-step instructions!

