# 🚀 Apillon Web3 Hosting Deployment Guide

This guide will help you set up automatic deployment of your Ichimoku Trading Scanner to Apillon's decentralized Web3 hosting platform.

## 🛠️ Prerequisites

1. **GitHub Repository Connected**: Your Lovable project should be connected to GitHub
2. **Apillon Account**: Create an account at [app.apillon.io](https://app.apillon.io)
3. **Apillon Project**: Create a new Web3 Hosting project in Apillon dashboard

## 📋 Setup Steps

### 1. Get Apillon Credentials

1. Log into [Apillon Dashboard](https://app.apillon.io)
2. Create a new **Web3 Hosting** project
3. Note down your:
   - **API Key** (from Account Settings)
   - **Project UUID** (from project dashboard)
   - **Website UUID** (from website settings)

### 2. Add GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and Variables → Actions** and add:

```
APILLON_API_KEY=your_api_key_here
APILLON_PROJECT_UUID=your_project_uuid_here
APILLON_WEBSITE_UUID=your_website_uuid_here
```

### 3. Choose Deployment Method

We've provided two GitHub Actions workflows:

#### Option A: Using Apillon CLI (Recommended)
- File: `.github/workflows/deploy-apillon.yml`
- Uses official Apillon CLI
- Supports staging and production environments
- More reliable and feature-complete

#### Option B: Direct API Integration
- File: `.github/workflows/deploy-alternative.yml`
- Uses Apillon REST API directly
- More control over deployment process
- Good for custom deployment logic

**Choose one method and delete the other workflow file.**

## 🔄 How It Works

1. **Code Changes**: You make changes in Lovable
2. **Auto Sync**: Changes automatically sync to GitHub
3. **GitHub Actions**: Workflow triggers on push to main/master
4. **Build Process**: React app gets built (`npm run build`)
5. **Upload to Apillon**: Files uploaded to Apillon's cloud
6. **IPFS Deployment**: Files deployed to decentralized IPFS network
7. **Live Site**: Your site is now live on Web3!

## 🌐 Deployment Environments

- **Staging**: Every push to main/master creates staging deployment
- **Production**: Production deployment happens on main/master (configurable)

## 🔧 Custom Domain Setup

1. In Apillon dashboard, go to your website settings
2. Add your custom domain
3. Update your domain's DNS records as instructed
4. SSL certificates are automatically generated

## 🔍 Troubleshooting Deployment Issues

### 1. Verify GitHub Secrets
Double-check all secrets are properly configured:
- Go to your repository → **Settings** → **Secrets and variables** → **Actions**
- Ensure these secrets exist with correct values:
  - `APILLON_API_KEY` 
  - `APILLON_PROJECT_UUID`
  - `APILLON_WEBSITE_UUID`

### 2. Use Debug Workflow
Run the debug workflow to identify specific issues:
1. Go to your repository → **Actions** tab
2. Select **Debug Apillon Deployment** workflow  
3. Click **Run workflow** button
4. Review the detailed logs for errors

### 3. Common Error Solutions

**"Secret not found" errors:**
- Re-create the GitHub secret with correct name
- Ensure no extra spaces in secret values
- Copy UUIDs directly from Apillon dashboard

**Build failures:**
- Check if `npm run build` works locally
- Verify all dependencies are compatible
- Look for TypeScript compilation errors

**Apillon CLI errors:**
- Invalid API key: Generate new key in Apillon dashboard
- Project/Website not found: Double-check UUIDs
- Network timeout: Re-run the workflow

**"dist folder not found":**
- Build process failed - check build step logs
- Ensure Vite configuration is correct

### 4. Manual Local Testing
Test your build locally before deploying:
```bash
# Clone your repository
git clone your-repo-url
cd your-repo

# Install and build
npm install
npm run build

# Verify build output
ls -la dist/
```

### 5. Step-by-Step Debugging
If deployment still fails:

1. **Check the Actions logs**: Go to Actions → failed run → click each step
2. **Verify build output**: Ensure `dist/` folder contains `index.html`
3. **Test Apillon credentials**: Use debug workflow to test CLI configuration
4. **Check Apillon dashboard**: Verify project and website exist
5. **Review workflow file**: Ensure no syntax errors in YAML

## 📊 Benefits

- ✅ **Decentralized**: Your site lives on IPFS
- ✅ **Unstoppable**: No single point of failure
- ✅ **Fast**: Global CDN via decentralized nodes
- ✅ **Secure**: Immutable deployments
- ✅ **Cost-Effective**: Pay only for what you use

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are properly installed
- Check for TypeScript errors

### Deployment Fails
- Verify GitHub secrets are correctly set
- Check Apillon API credentials
- Ensure website UUID exists in Apillon dashboard

### Site Not Loading
- Check deployment status in Apillon dashboard
- Verify DNS records for custom domains
- Clear browser cache

## 🔗 Useful Links

- [Apillon Documentation](https://wiki.apillon.io/)
- [Apillon Web3 Hosting Guide](https://wiki.apillon.io/web3-services/3-web3-hosting.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 💡 Next Steps

After successful deployment:

1. **Monitor**: Check deployment status in Apillon dashboard
2. **Domain**: Set up your custom domain
3. **Analytics**: Enable Web3 analytics (if available)
4. **Optimize**: Configure caching and performance settings

Your decentralized trading scanner is now truly unstoppable! 🎉