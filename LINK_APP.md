# Link Your App After Creation

Once you've created the app at https://app.encore.cloud/create-app, link it:

## Step 1: Note Your App ID

After creating in the dashboard, you'll see an app ID or name. Write it down.

## Step 2: Link Locally

```bash
cd /Users/klanier/Desktop/Station15/station15/apps/engine
export PATH="$HOME/.encore/bin:$PATH"

# Link to your app
encore app link
```

This will prompt you to select your app - choose `station15-engine`.

## Step 3: Verify

```bash
encore app list
```

Should show your app.

## Step 4: Now Get API Key

Once linked:
1. Go to: https://app.encore.cloud
2. Click on your app `station15-engine`
3. Look for "Settings" or "API Keys"
4. Create API key named "GitHub Actions"

---

**Do Step 1 first** - create the app in the dashboard, then come back!

