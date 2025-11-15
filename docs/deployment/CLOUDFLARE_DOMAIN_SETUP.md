# Cloudflare Pages Domain Setup for www.vinaygautam.com

## Issue: 522 Error on www.vinaygautam.com

A 522 error means Cloudflare Pages cannot reach your deployment. This is typically because the domain isn't properly connected.

## Solution: Connect www.vinaygautam.com to Cloudflare Pages

### Step 1: Add Custom Domain in Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Navigate to [dash.cloudflare.com](https://dash.cloudflare.com/)
   - Click on **"Workers & Pages"** in the sidebar
   - Select your portfolio project

2. **Add Custom Domain**
   - Click on **"Custom domains"** tab
   - Click **"Set up a custom domain"**
   - Enter: `www.vinaygautam.com`
   - Click **"Continue"**

3. **Verify DNS Records**
   - Cloudflare will show you the DNS records needed
   - Make sure you have a CNAME record:
     - **Name**: `www`
     - **Target**: Your Cloudflare Pages URL (e.g., `your-project.pages.dev`)
     - **Proxy status**: Proxied (orange cloud)

### Step 2: Set Up Redirect from non-www to www

Since `_redirects` file doesn't work for cross-domain redirects in Cloudflare Pages, use one of these methods:

#### Option A: Cloudflare Page Rules (Recommended)

1. **Go to Cloudflare Dashboard**
   - Select your domain `vinaygautam.com`
   - Go to **"Rules"** → **"Page Rules"**

2. **Create a Page Rule**
   - Click **"Create Page Rule"**
   - **URL**: `vinaygautam.com/*`
   - **Setting**: "Forwarding URL"
   - **Status Code**: 301 - Permanent Redirect
   - **Destination URL**: `https://www.vinaygautam.com/$1`
   - Click **"Save and Deploy"**

#### Option B: Add Both Domains to Pages

1. **Add both domains to Cloudflare Pages**
   - Add `vinaygautam.com` (without www)
   - Add `www.vinaygautam.com`
   - Set `www.vinaygautam.com` as the primary domain

2. **Use Cloudflare Redirect Rules**
   - Go to **"Rules"** → **"Redirect Rules"**
   - Create a redirect from `vinaygautam.com/*` to `https://www.vinaygautam.com/$1` with 301 status

### Step 3: Verify SSL/TLS Settings

1. **Go to SSL/TLS Settings**
   - In Cloudflare Dashboard, select your domain
   - Go to **"SSL/TLS"** → **"Overview"**
   - Set encryption mode to **"Full"** or **"Full (strict)"**

2. **Check SSL Certificate**
   - Go to **"SSL/TLS"** → **"Edge Certificates"**
   - Ensure "Always Use HTTPS" is enabled
   - Ensure "Automatic HTTPS Rewrites" is enabled

### Step 4: Verify DNS Records

Make sure you have these DNS records:

```
Type    Name    Content                    Proxy
CNAME   www     your-project.pages.dev     Proxied (orange cloud)
A       @       (your server IP if needed) Proxied
```

### Step 5: Wait for Propagation

- DNS changes can take a few minutes to propagate
- SSL certificate provisioning can take up to 24 hours
- Check the status in Cloudflare Pages dashboard

### Troubleshooting

1. **Check Deployment Status**
   - Go to Cloudflare Pages dashboard
   - Verify your latest deployment is successful
   - Check build logs for any errors

2. **Check Domain Status**
   - In Cloudflare Pages, go to "Custom domains"
   - Verify `www.vinaygautam.com` shows as "Active"
   - If it shows "Pending", wait for DNS/SSL propagation

3. **Test Direct Access**
   - Try accessing your Pages URL directly: `https://your-project.pages.dev`
   - If this works but the custom domain doesn't, it's a DNS/domain issue

4. **Clear Cache**
   - In Cloudflare Dashboard, go to **"Caching"** → **"Configuration"**
   - Click **"Purge Everything"** to clear cache

## Important Notes

- The `_redirects` file in the `public` folder only works for path-based redirects within the same domain
- For domain redirects (non-www to www), use Cloudflare Page Rules or Redirect Rules
- Make sure both domains are added to Cloudflare Pages if you want to redirect between them
