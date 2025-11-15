# Deploy DatumInt to datumint.no - Step by Step

## Current Status ✅
- ✅ Config updated: `base` path removed
- ✅ Site URL set to: `https://datumint.no`
- ⏳ Needs: Separate Cloudflare Pages deployment

## Quick Deployment Steps

### Step 1: Verify Config is Correct
The config should already be updated, but verify:
```bash
cat public/datumint_consulting/astro.config.mjs
```
Should show:
- `site: "https://datumint.no"`
- `base` path commented out or removed

### Step 2: Create New Cloudflare Pages Project

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Click: **Workers & Pages** → **Create application** → **Pages**

2. **Import Repository**
   - Click: **"Import a repository"**
   - Select: Your repository (same one as portfolio: `drvgautam/datumint`)

3. **Configure Build Settings** ⚠️ **CRITICAL**
   - **Project name**: `datumint-consulting` (or any name you prefer)
   - **Production branch**: `main`
   - **Root directory**: `public/datumint_consulting` ⚠️ **MUST SET THIS**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: Auto-detected (should be 18+)

4. **Click "Save and Deploy"**

### Step 3: Add Custom Domain

1. **In the new project**, go to: **Custom domains** → **Set up a custom domain**

2. **Add Domain**:
   - Enter: `datumint.no`
   - Or enter: `www.datumint.no` (if you prefer www subdomain)
   - Or add both: `datumint.no` and `www.datumint.no`

3. **DNS Configuration**:

   **Option A: Domain already on Cloudflare**
   - Cloudflare will automatically add DNS records
   - Wait for SSL certificate (usually 1-5 minutes)

   **Option B: Domain NOT on Cloudflare**
   - Add `datumint.no` to Cloudflare:
     - Go to: **Websites** → **Add a site**
     - Enter: `datumint.no`
     - Choose plan (Free is fine)
   - Update nameservers at your registrar:
     - Copy nameservers from Cloudflare
     - Update at your domain registrar
     - Wait for DNS propagation (can take up to 24 hours, usually 1-2 hours)

4. **SSL/TLS Settings**:
   - Go to: **SSL/TLS** → **Overview**
   - Set encryption mode to: **"Full"** or **"Full (strict)"**

### Step 4: Verify Deployment

1. **Check Build Status**:
   - Go to project → **Deployments**
   - Ensure build succeeded (green checkmark)

2. **Test URLs**:
   - `https://datumint.no` (should load the DatumInt site)
   - `https://www.datumint.no` (if you added www)
   - All pages should work correctly

3. **Verify SSL**:
   - Check for padlock icon in browser
   - URL should show `https://` (not `http://`)

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare dashboard
- Ensure `public/datumint_consulting/package.json` exists
- Verify Node version is 18+

### Domain Not Working
- Check DNS records in Cloudflare
- Verify nameservers are updated at registrar
- Wait for DNS propagation (can take time)
- Check SSL/TLS status

### Wrong Content Showing
- Verify **Root directory** is set to: `public/datumint_consulting`
- Rebuild the project if needed

## Summary

**What you're doing:**
- Creating a **second Cloudflare Pages project** (separate from portfolio)
- Using the **same GitHub repository**
- Setting **root directory** to `public/datumint_consulting`
- Adding `datumint.no` as custom domain

**Result:**
- `https://vinaygautam.com` → Portfolio site
- `https://datumint.no` → DatumInt consulting site
- Both from same repo, different deployments! 🎉

