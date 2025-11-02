# GitHub Setup Guide

This guide walks you through connecting your local project to GitHub and setting up deployment.

## Step 1: Link Local Repository to GitHub

**GitHub Repository:** https://github.com/KDL-tw/station15.git  
**Supabase Project ID:** `iodzosdpafidkvujdcxf` (for Supabase, not GitHub)

### Option A: Using GitHub CLI (Recommended)

1. **Install GitHub CLI** (if not already installed):
   ```bash
   brew install gh
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```
   - Follow the prompts to authenticate
   - Choose your preferred authentication method (web browser recommended)

3. **Link to your GitHub project**:
   ```bash
   cd /Users/klanier/Desktop/Station15/station15
   gh repo set-default <your-github-username>/<your-repo-name>
   git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
   ```

### Option B: Using GitHub Web Interface

1. Go to your GitHub project: `https://github.com/projects/iodzosdpafidkvujdcxf`

2. Find your repository URL (it should be something like `https://github.com/<username>/<repo>.git`)

3. **In your terminal**, run:
   ```bash
   cd /Users/klanier/Desktop/Station15/station15
   git remote add origin <your-repo-url>
   ```

## Step 2: Make Initial Commit

The code has been prepared. Run these commands:

```bash
cd /Users/klanier/Desktop/Station15/station15
git add .
git commit -m "Initial commit: Station 15 MVP with PRD compliance"
git branch -M main
git push -u origin main
```

If you get authentication errors, you may need to:
- Set up SSH keys for GitHub, OR
- Use a personal access token instead of password

## Step 3: Configure GitHub Secrets

For auto-deployment to work, you need to add secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

### Required Secrets:

1. **ENCORE_API_KEY**
   - Get this from: https://encore.dev/dash
   - Go to your account → API Keys
   - Create a new API key and paste it here

2. **SUPABASE_URL**
   - If using Supabase cloud: `https://your-project.supabase.co`
   - If using local: `http://localhost:54321`

3. **SUPABASE_SERVICE_ROLE**
   - Get from Supabase dashboard → Settings → API
   - Service Role key (NOT the anon key)

4. **NEXT_PUBLIC_SUPABASE_URL**
   - Same as SUPABASE_URL

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Get from Supabase dashboard → Settings → API
   - Anon/public key

6. **ENGINE_SHARED_SECRET**
   - Generate a random string for demo authentication
   - Example: `openssl rand -hex 32`

7. **FEATURE_DEMO_SIM**
   - Set to: `true` (for demo features)

8. **FEATURE_FAKE_AUTH**
   - Set to: `true` (for demo authentication)

## Step 4: Verify GitHub Actions

After pushing code and setting secrets:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see the "Deploy Station 15" workflow
4. On the next push to `main`, it will automatically:
   - Test the builds
   - Deploy Encore backend to dev environment

## Step 5: Test Local Development

Before deploying, test locally:

```bash
# Terminal 1: Start Supabase
cd /Users/klanier/Desktop/Station15/station15
supabase start

# Terminal 2: Start Encore
cd /Users/klanier/Desktop/Station15/station15/apps/engine
encore run

# Terminal 3: Start Next.js
cd /Users/klanier/Desktop/Station15/station15/apps/web
npm install
npm run dev
```

## Troubleshooting

### "Repository not found" error
- Make sure you've added the correct remote URL
- Verify your GitHub authentication

### "Permission denied" error
- Use a Personal Access Token instead of password
- Generate one: GitHub → Settings → Developer settings → Personal access tokens

### Encore deployment fails
- Verify `ENCORE_API_KEY` secret is set correctly
- Check that you're authenticated: `encore auth`

### Supabase connection fails
- Verify Supabase is running locally: `supabase status`
- Check that your secrets match your Supabase project settings

