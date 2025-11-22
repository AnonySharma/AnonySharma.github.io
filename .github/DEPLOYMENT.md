# GitHub Pages Deployment Setup

This repository uses GitHub Actions to automatically build and deploy to GitHub Pages.

## Initial Setup

1. **Enable GitHub Pages with GitHub Actions:**
   - Go to your repository: `https://github.com/AnonySharma/AnonySharma.github.io`
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
   - Save the settings

2. **Optional: Add Environment Variables**
   - If you need `GEMINI_API_KEY` for the build:
     - Go to **Settings** → **Secrets and variables** → **Actions**
     - Click **New repository secret**
     - Name: `GEMINI_API_KEY`
     - Value: Your API key
     - Update `.github/workflows/deploy.yml` to uncomment the env variable

## How It Works

- **Automatic Deployment**: Every push to the `master` branch triggers a build and deployment
- **Manual Deployment**: You can also trigger deployments manually from the Actions tab
- **Progress Tracking**: Check the **Actions** tab to see real-time build and deployment progress

## Viewing Deployment Status

1. Go to: `https://github.com/AnonySharma/AnonySharma.github.io/actions`
2. Click on the latest workflow run to see:
   - Build progress
   - Deployment status
   - Any errors or warnings
   - Deployment URL

## Deployment Workflow

The workflow (`deploy.yml`) does the following:
1. Checks out your code
2. Sets up Node.js 20
3. Installs dependencies (`npm ci`)
4. Builds the project (`npm run build`)
5. Deploys to GitHub Pages

## Troubleshooting

- If deployment fails, check the Actions tab for error messages
- Make sure GitHub Pages is set to use "GitHub Actions" as the source
- Verify Node.js version compatibility if build fails

