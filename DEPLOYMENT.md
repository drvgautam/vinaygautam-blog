# Deployment Guide: Cloudflare Pages

This guide will walk you through deploying your portfolio site (`vinaygautam.com`) to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://www.cloudflare.com/)
2. **Domain**: You already have `vinaygautam.com` configured
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is Committed

```bash
# Check git status
git status

# If you have uncommitted changes, commit them
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
```

### 1.2 Push to Remote Repository

```bash
# If you haven't set up a remote yet
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 2: Build Configuration

Your project is already configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Node.js version: Will be auto-detected

The `.cloudflare/pages.json` file has been created with the correct settings.

## Step 3: Deploy to Cloudflare Pages

### Option A: Deploy via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
   - Sign in with your account

2. **Navigate to Pages**
   - Click on **"Workers & Pages"** in the sidebar
   - Click **"Create application"**
   - Select **"Pages"** tab
   - You'll see several options:
     - ✅ **Select "Import a repository"** (This is the correct option for your Astro site)
     - ❌ Don't use "Select a template" (for pre-built solutions)
     - ❌ Don't use "Drag and drop your files" (for static HTML uploads)
     - ❌ Don't use "Start with Hello World!" (for testing)

3. **Connect Your Repository**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repositories
   - Select the repository containing your portfolio code
   - Click **"Begin setup"**

4. **Configure Build Settings**
   - **Project name**: `vinaygautam-portfolio` (or any name you prefer)
   - **Production branch**: `main` (or `master` if that's your default branch)
   - **Build command**: `npm run build` (should auto-detect)
   - **Build output directory**: `dist` (should auto-detect)
   - **Root directory**: `/` (leave as default unless your Astro project is in a subdirectory)
   - **Environment variables**: None required for basic setup

5. **Deploy**
   - Click **"Save and Deploy"**
   - Cloudflare will start building your site
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Wrangler CLI

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   # From your project root
   npm run build
   wrangler pages deploy dist --project-name=vinaygautam-portfolio
   ```

## Step 4: Configure Custom Domain

### 4.1 Add Custom Domain in Cloudflare Pages

1. **In Cloudflare Pages Dashboard**
   - Go to your project
   - Click on **"Custom domains"** tab
   - Click **"Set up a custom domain"**
   - Enter: `vinaygautam.com`
   - Click **"Continue"**

2. **DNS Configuration**
   - Cloudflare will provide DNS records to add
   - If your domain is already on Cloudflare:
     - The DNS records will be automatically configured
   - If your domain is on another registrar:
     - Add a CNAME record:
       - **Type**: CNAME
       - **Name**: `@` (or root domain)
       - **Target**: `vinaygautam-portfolio.pages.dev` (or the provided Pages URL)
       - **TTL**: Auto
     - For `www` subdomain:
       - **Type**: CNAME
       - **Name**: `www`
       - **Target**: `vinaygautam-portfolio.pages.dev`
       - **TTL**: Auto

3. **SSL/TLS Configuration**
   - Cloudflare automatically provisions SSL certificates
   - Go to **SSL/TLS** → **Overview**
   - Ensure it's set to **"Full"** or **"Full (strict)"**
   - Wait for SSL certificate to be issued (usually a few minutes)

### 4.2 Verify Domain Setup

1. **Check DNS Propagation**
   ```bash
   # Check if DNS is resolving
   dig vinaygautam.com
   nslookup vinaygautam.com
   ```

2. **Test Your Site**
   - Visit `https://vinaygautam.com` in your browser
   - Check that the site loads correctly
   - Verify SSL certificate is active (green padlock)

## Step 5: Configure Environment Variables (If Needed)

If you need environment variables:

1. **In Cloudflare Pages Dashboard**
   - Go to your project
   - Click **"Settings"** → **"Environment variables"**
   - Add variables for:
     - Production
     - Preview (optional)
     - Branch-specific (optional)

## Step 6: Set Up Continuous Deployment

Cloudflare Pages automatically:
- ✅ Deploys on every push to your main branch
- ✅ Creates preview deployments for pull requests
- ✅ Rebuilds on every commit

### Manual Deployment (If Needed)

You can trigger a manual deployment:
1. Go to your project in Cloudflare Pages
2. Click **"Deployments"** tab
3. Click **"Retry deployment"** or **"Create deployment"**

## Step 7: Performance Optimization

### 7.1 Enable Cloudflare Features

1. **Auto Minify**
   - Go to **Speed** → **Optimization**
   - Enable: JavaScript, CSS, HTML minification

2. **Brotli Compression**
   - Already enabled by default on Cloudflare

3. **Caching**
   - Cloudflare automatically caches static assets
   - Configure cache rules if needed in **Rules** → **Cache Rules**

### 7.2 Verify Build Output

After deployment, verify:
- ✅ Site loads at `https://vinaygautam.com`
- ✅ All pages are accessible
- ✅ Images and assets load correctly
- ✅ Sitemap is accessible: `https://vinaygautam.com/sitemap-index.xml`
- ✅ RSS feed works: `https://vinaygautam.com/rss.xml`
- ✅ Robots.txt is accessible: `https://vinaygautam.com/robots.txt`

## Step 8: Monitor and Maintain

### 8.1 View Analytics

- Go to **Analytics** tab in Cloudflare Pages
- Monitor:
  - Page views
  - Bandwidth usage
  - Build times
  - Deployment history

### 8.2 Set Up Alerts

- Configure email notifications for:
  - Failed builds
  - Successful deployments
  - Domain issues

## Troubleshooting

### Build Fails

1. **Check Build Logs**
   - Go to **Deployments** → Click on failed deployment
   - Review error messages

2. **Common Issues**
   - Missing dependencies: Ensure `package.json` has all dependencies
   - Node version: Cloudflare uses Node 18+ by default
   - Build timeout: Large builds may timeout (contact support if needed)

### Domain Not Resolving

1. **Check DNS Records**
   - Verify CNAME records are correct
   - Wait for DNS propagation (up to 48 hours, usually faster)

2. **Check SSL Certificate**
   - Ensure SSL/TLS mode is set to "Full" or "Full (strict)"
   - Wait for certificate provisioning

### Site Not Updating

1. **Clear Cache**
   - Cloudflare may cache old content
   - Go to **Caching** → **Purge Everything**

2. **Check Deployment Status**
   - Ensure latest deployment succeeded
   - Verify you're viewing the correct branch

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Community](https://community.cloudflare.com/)

## Quick Reference

- **Project Name**: `vinaygautam-portfolio`
- **Domain**: `vinaygautam.com`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Auto-detected (18+)

---

**Note**: For your consultancy site (`datumint.no`), you can follow the same process but create a separate Cloudflare Pages project and configure it with the `datumint.no` domain.

