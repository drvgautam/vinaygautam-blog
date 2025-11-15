# Cloudflare Pages - Quick Start Guide

## 🚀 Quick Deployment Steps

### 1. Push Your Code to Git
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

### 2. Deploy via Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Click **"Workers & Pages"** → **"Create application"** → **"Pages"** tab
3. **Select "Import a repository"** (NOT "Select a template" or "Drag and drop")
4. Select your Git provider (GitHub, GitLab, or Bitbucket) and authorize Cloudflare
5. Select your repository containing the portfolio code
4. Configure:
   - **Project name**: `vinaygautam-portfolio`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **"Save and Deploy"**

### 3. Add Custom Domain

1. In your project → **"Custom domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `vinaygautam.com`
4. **When prompted about domain transfer:**
   - Choose **"Add site"** or **"Use DNS only"** (recommended)
   - This keeps your domain at your current registrar
   - You'll just use Cloudflare's DNS servers
5. **If domain is not on Cloudflare:**
   - Go to Cloudflare Dashboard → **"Websites"** → **"Add a site"**
   - Enter `vinaygautam.com` → Select **"Free"** plan
   - Update nameservers at your registrar (Cloudflare will show you the nameservers)
6. **DNS will auto-configure** once nameservers are updated

### 4. Verify Deployment

- ✅ Site: `https://vinaygautam.com`
- ✅ Sitemap: `https://vinaygautam.com/sitemap-index.xml`
- ✅ RSS: `https://vinaygautam.com/rss.xml`
- ✅ Robots: `https://vinaygautam.com/robots.txt`

## 📋 Build Configuration

- **Framework**: Astro
- **Node Version**: Auto-detected (18+)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 🔧 Troubleshooting

**Build fails?**
- Check build logs in Cloudflare dashboard
- Ensure all dependencies are in `package.json`

**Domain not working?**
- Verify DNS records (CNAME to `*.pages.dev`)
- Check SSL/TLS mode is "Full"
- Wait for DNS propagation (up to 48h, usually faster)

**Site not updating?**
- Purge cache: **Caching** → **Purge Everything**
- Verify latest deployment succeeded

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed instructions.

