# Fixed Port 3000 Issue

## What Happened

Port 3000 was being used by another application (Alloi Group website). I've stopped it and started Station 15.

## What to Do Now

**Wait about 10 seconds**, then:

1. **Refresh your browser** at http://localhost:3000
2. **Or try:** http://localhost:3000 (open in new tab)

You should now see:
- ✅ Station 15 dashboard
- ✅ Indigo/Crimson branding
- ✅ "Keep Moving" tagline
- ✅ Business metrics cards

## If You Still See Alloi Group

The old app might have restarted. Run this to stop everything on port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

Then wait 10 seconds and refresh.

## Or Use a Different Port

If port 3000 keeps getting taken, Next.js will ask to use port 3001. That's fine - just use whatever port it shows!

## Start Station 15 Manually

To make sure Station 15 is running:

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/web
npm run dev
```

It will tell you what port it's using (usually 3000 or 3001).

---

**Try http://localhost:3000 now - should show Station 15!** 🚀

