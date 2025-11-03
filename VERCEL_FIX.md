# Fix Vercel Build Error

## Problem
Vercel can't find Next.js because it's looking in the root directory, but your app is in `apps/web`.

## Solution: Set Root Directory in Vercel

### Step 1: Go to Project Settings
1. Go to your Vercel dashboard: https://vercel.com
2. Click on your **Station 15** project
3. Click **Settings** (gear icon)

### Step 2: Set Root Directory
1. Scroll down to **Root Directory**
2. Click **Edit**
3. Select **"Set a different root directory"**
4. Enter: `apps/web`
5. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **3 dots** on the latest deployment
3. Click **Redeploy**

## Alternative: Manual Configuration

If you can't find the Root Directory setting, you can also:

1. Delete the project in Vercel
2. Re-import the repository
3. **During import**, when asked for "Root Directory", enter: `apps/web`
4. Complete the setup

## Verify It's Working

After setting the root directory, the build should:
- ✅ Find `package.json` in `apps/web`
- ✅ Install Next.js dependencies
- ✅ Build successfully

---

**The fix:** Set Root Directory to `apps/web` in Vercel project settings!

