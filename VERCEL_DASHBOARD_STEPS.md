# 🎯 EXACT STEPS TO FIX VERCEL

The error shows Vercel is still looking in the **root directory** instead of `apps/web/`.

## ✅ You MUST Set This in Vercel Dashboard

### Step-by-Step (with screenshots locations):

1. **Open Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Find and **click** your "Station 15" project

2. **Open Settings**
   - Look for **"Settings"** in the top navigation bar (or left sidebar)
   - Click it

3. **Find "Root Directory"**
   - In Settings, scroll down to the **"General"** section
   - You'll see:
     - Name
     - Framework Preset
     - **Root Directory** ← **THIS ONE!**
     - Node.js Version
     - etc.

4. **Edit Root Directory**
   - Next to "Root Directory", click the **"Edit"** button (pencil icon)
   - It will show: `Root` or `/` or empty
   - Change it to: **`apps/web`**
   - Click **"Save"** or **"Update"**

5. **Verify the Change**
   - You should see "Root Directory: apps/web" in the settings

6. **Redeploy**
   - Go to **"Deployments"** tab
   - Find the failed deployment (red X icon)
   - Click the **3 dots (⋯)** menu button on it
   - Click **"Redeploy"**
   - Or trigger a new deployment from GitHub

## ❌ What NOT to Do

- Don't rely on `vercel.json` alone (won't work without dashboard setting)
- Don't skip the dashboard setting
- Don't expect it to auto-detect (monorepos need manual config)

## ✅ What WILL Work

After setting Root Directory to `apps/web` in the dashboard:
- ✅ Vercel will look in `apps/web/package.json`
- ✅ It will find Next.js 16.0.1
- ✅ Build will succeed

---

**The key:** You MUST set "Root Directory" to `apps/web` in the Vercel dashboard Settings page. This cannot be done via files alone.

