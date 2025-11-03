# 🚨 FIX YOUR VERCEL BUILD ERROR

## Quick Fix (2 minutes)

### The Problem:
Vercel is building from the wrong directory. Your Next.js app is in `apps/web/` but Vercel is looking in the root.

### The Solution:

1. **Go to:** https://vercel.com/dashboard
2. **Click** your Station 15 project
3. **Click** "Settings" (gear icon)
4. **Scroll down** to "Root Directory"
5. **Click** "Edit"
6. **Change** from "Root" to **`apps/web`**
7. **Click** "Save"
8. **Go to** "Deployments" tab
9. **Click** the 3 dots (⋯) on latest deployment
10. **Click** "Redeploy"

## That's It!

The build will now find your `package.json` and Next.js will work.

---

**Need help?** See `VERCEL_ROOT_DIRECTORY.md` for detailed screenshots/instructions.

