# Deploying datumint.no to Cloudflare Pages

## Overview

`datumint.no` is a **separate Astro project** that needs its own Cloudflare Pages deployment. It's located in the `public/datumint_consulting/` directory and has its own configuration.

## Current Setup

- **Location**: `/public/datumint_consulting/`
- **Domain**: `datumint.no`
- **Status**: Separate Astro project with its own `astro.config.mjs` and `package.json`

## Deployment Options

### Option 1: Deploy from Same Repository (Recommended)

Since `datumint_consulting` is in the same repository, you can deploy it as a separate Cloudflare Pages project:

1. **Create New Cloudflare Pages Project**
   - Go to Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**
   - Select **"Import a repository"**
   - Choose the same repository: `drvgautam/datumint`

2. **Configure Build Settings**
   - **Project name**: `datumint-consulting`
   - **Production branch**: `main`
   - **Root directory**: `/public/datumint_consulting` ⚠️ **IMPORTANT**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: Auto-detected

3. **Add Custom Domain**
   - After deployment, add `datumint.no` as custom domain
   - Follow the same DNS setup process as `vinaygautam.com`

### Option 2: Move to Separate Repository (If Preferred)

If you want complete separation:

1. **Create New Repository**
   ```bash
   # Create a new repo for datumint
   git clone https://github.com/drvgautam/datumint.git datumint-consulting
   cd datumint-consulting
   
   # Remove everything except datumint_consulting
   git rm -r --cached .
   git add public/datumint_consulting/
   git commit -m "Extract datumint consulting to separate repo"
   git push origin main
   ```

2. **Deploy from New Repository**
   - Create new Cloudflare Pages project
   - Connect to the new repository
   - Root directory: `/` (since it's now the root)

## Important Configuration Notes

### Current Config Issue

The `datumint_consulting/astro.config.mjs` currently has:
```javascript
base: "/datumint_consulting"
```

This means it's configured to be served from a subdirectory. For `datumint.no` to work as a root domain, you need to:

1. **Update `astro.config.mjs`**:
   ```javascript
   import { defineConfig } from 'astro/config';
   export default defineConfig({
     site: "https://datumint.no",
     // Remove or comment out the base path:
     // base: "/datumint_consulting",  // Remove this line
   });
   ```

2. **Rebuild the site** after this change

## Step-by-Step: Deploy from Same Repo

### Step 1: Update Astro Config

1. Edit `public/datumint_consulting/astro.config.mjs`
2. Remove or comment out `base: "/datumint_consulting"`
3. Ensure `site: "https://datumint.no"` is set
4. Commit and push:
   ```bash
   git add public/datumint_consulting/astro.config.mjs
   git commit -m "Update datumint config for root domain deployment"
   git push origin main
   ```

### Step 2: Create Cloudflare Pages Project

1. **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages**
2. **Import repository**: `drvgautam/datumint`
3. **Configure**:
   - Project name: `datumint-consulting`
   - Production branch: `main`
   - **Root directory**: `public/datumint_consulting` ⚠️ **Critical**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Click **"Save and Deploy"**

### Step 3: Add Custom Domain

1. In project → **Custom domains** → **Set up a custom domain**
2. Enter: `datumint.no`
3. Choose **"Add site"** or **"Use DNS only"** (same as before)
4. If domain not on Cloudflare:
   - Add `datumint.no` to Cloudflare (Websites → Add a site)
   - Update nameservers at registrar
5. Configure SSL/TLS → Set to **"Full"**

### Step 4: Verify

- ✅ Site loads: `https://datumint.no`
- ✅ All pages work correctly
- ✅ SSL certificate active

## Summary

- **Yes, you need to set up `datumint.no` separately**
- It's a separate Astro project in `public/datumint_consulting/`
- Create a **new Cloudflare Pages project** for it
- Use **root directory**: `public/datumint_consulting`
- Update the `base` path in config before deploying
- Add `datumint.no` as a custom domain

## Quick Checklist

- [ ] Update `public/datumint_consulting/astro.config.mjs` (remove `base` path)
- [ ] Commit and push changes
- [ ] Create new Cloudflare Pages project
- [ ] Set root directory to `public/datumint_consulting`
- [ ] Deploy and verify build succeeds
- [ ] Add `datumint.no` as custom domain
- [ ] Update DNS nameservers (if needed)
- [ ] Verify SSL certificate
- [ ] Test site at `https://datumint.no`


