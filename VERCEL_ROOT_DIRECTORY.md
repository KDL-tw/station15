# ⚠️ Vercel Build Error Fix

## Problem
Vercel is building from the **root directory** (`/`), but your Next.js app is in **`apps/web/`**.

## ✅ Solution: Set Root Directory in Vercel Dashboard

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Click on your **Station 15** project

2. **Open Settings**
   - Click **Settings** (gear icon in top right or sidebar)

3. **Find "Root Directory"**
   - Scroll down to the **"General"** section
   - Look for **"Root Directory"**
   - Click **"Edit"**

4. **Set Root Directory**
   - Change from **"Root"** to **"Set a different root directory"**
   - Enter: `apps/web`
   - Click **"Save"**

5. **Redeploy**
   - Go to **"Deployments"** tab
   - Click the **3 dots** (⋯) on the failed deployment
   - Click **"Redeploy"**

## Alternative: Re-import Project

If you can't find the Root Directory setting:

1. **Delete the current project** in Vercel (Settings → Delete)
2. **Re-import** your GitHub repo
3. **During setup**, when prompted:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web` ⚠️ **This is critical!**
4. **Complete setup** and deploy

## Verify It's Fixed

After setting the root directory, the build log should show:
- ✅ "Installing dependencies..." from `apps/web`
- ✅ "Running next build"
- ✅ Build succeeds

---

**The fix is:** Set Root Directory to `apps/web` in your Vercel project settings!

