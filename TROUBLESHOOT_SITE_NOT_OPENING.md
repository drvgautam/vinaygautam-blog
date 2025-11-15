# Troubleshooting: Site Not Opening After DNS is Active

## Quick Checklist

### 1. Check Deployment Status

1. **Go to Pages Dashboard**:
   - Navigate to your Pages project: `vinaygautam-blog`
   - Click on **"Deployments"** tab
   - Check the latest deployment status

2. **What to look for**:
   - ✅ **Success** (green) - Deployment completed successfully
   - ⚠️ **Building** - Still in progress, wait for it to complete
   - ❌ **Failed** - Check build logs for errors

3. **If deployment failed**:
   - Click on the failed deployment
   - Review the build logs
   - Common issues:
     - Build command errors
     - Missing dependencies
     - TypeScript/compilation errors

### 2. Check SSL Certificate Status

1. **Go to SSL/TLS Settings**:
   - In Cloudflare Dashboard, select domain `vinaygautam.com`
   - Go to **"SSL/TLS"** → **"Edge Certificates"**

2. **Check certificate status**:
   - Look for `www.vinaygautam.com` in the certificate list
   - Status should be **"Active"** or **"Pending"**
   - If "Pending", wait 5-10 minutes (can take up to 24 hours)

3. **Enable HTTPS settings**:
   - **"Always Use HTTPS"**: Should be **ON** ✅
   - **"Automatic HTTPS Rewrites"**: Should be **ON** ✅

### 3. Test Different URLs

Try accessing:
- `https://www.vinaygautam.com` (with https)
- `http://www.vinaygautam.com` (with http - should redirect to https)
- `https://vinaygautam-blog.pages.dev` (direct Pages URL - to verify deployment works)

**What error do you see?**
- "This site can't be reached" / Connection timeout
- SSL certificate error
- 404 Not Found
- 522/524 Cloudflare errors
- Blank page

### 4. Check DNS Propagation

1. **Verify DNS records**:
   - Go to DNS → Records
   - Verify both records exist and are Proxied:
     - CNAME `www` → `vinaygautam-blog.pages.dev` ✅
     - CNAME `@` → `vinaygautam-blog.pages.dev` ✅

2. **Test DNS resolution**:
   ```bash
   # In terminal, test DNS:
   dig www.vinaygautam.com
   # or
   nslookup www.vinaygautam.com
   ```
   - Should resolve to Cloudflare IPs (not your Pages URL directly)

### 5. Check Cloudflare Proxy Status

1. **Verify proxy is enabled**:
   - Go to DNS → Records
   - Both CNAME records should show **orange cloud** (Proxied)
   - If gray cloud (DNS only), click to toggle to Proxied

2. **Why this matters**:
   - Proxied (orange) = Traffic goes through Cloudflare
   - DNS only (gray) = Direct connection, may not work with Pages

### 6. Clear Cache

1. **Clear Cloudflare cache**:
   - Go to **"Caching"** → **"Configuration"**
   - Click **"Purge Everything"**

2. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private browsing mode

### 7. Check Browser Console

1. **Open browser developer tools**:
   - Press `F12` or right-click → "Inspect"
   - Go to **"Console"** tab
   - Look for errors

2. **Check Network tab**:
   - Go to **"Network"** tab
   - Try loading the site
   - Check what requests fail and their status codes

## Common Issues and Solutions

### Issue: "This site can't be reached" / Connection timeout

**Possible causes**:
- SSL certificate not ready yet
- DNS not fully propagated
- Deployment still building

**Solutions**:
- Wait 5-10 minutes after DNS becomes active
- Check SSL certificate status
- Verify deployment is successful

### Issue: SSL Certificate Error

**Solution**:
- Wait for SSL certificate to be provisioned (up to 24 hours, usually 5-10 minutes)
- Check SSL/TLS → Edge Certificates
- Ensure "Always Use HTTPS" is enabled

### Issue: 404 Not Found

**Possible causes**:
- Build output directory incorrect
- Deployment failed
- Wrong domain configuration

**Solutions**:
- Check build output directory is `dist`
- Verify deployment succeeded
- Check Pages project settings

### Issue: 522/524 Cloudflare Errors

**Possible causes**:
- Pages deployment not connected properly
- Build failed
- Domain not properly linked

**Solutions**:
- Check deployment status
- Verify domain is correctly added in Pages
- Check build logs for errors

## Step-by-Step Diagnostic

1. **First, test the Pages URL directly**:
   - Visit: `https://vinaygautam-blog.pages.dev`
   - Does this work? 
     - ✅ **Yes** → Issue is with custom domain setup
     - ❌ **No** → Issue is with deployment/build

2. **If Pages URL works but custom domain doesn't**:
   - Check SSL certificate status
   - Verify DNS records are correct
   - Wait 5-10 minutes for propagation
   - Clear cache

3. **If Pages URL doesn't work**:
   - Check deployment status
   - Review build logs
   - Verify build completed successfully

## Quick Fixes to Try

1. **Wait 5-10 minutes** after DNS becomes active (SSL provisioning takes time)

2. **Force a new deployment**:
   - In Pages → Deployments
   - Click "Retry deployment" or push a new commit

3. **Remove and re-add domain**:
   - Remove `www.vinaygautam.com` from Pages
   - Wait 1 minute
   - Add it back
   - Let Cloudflare re-verify

4. **Check if site works on Pages URL**:
   - `https://vinaygautam-blog.pages.dev`
   - If this works, the issue is domain-specific
   - If this doesn't work, the issue is with the deployment

## What Information to Check

Please check and share:
1. What error message do you see? (screenshot if possible)
2. Does `https://vinaygautam-blog.pages.dev` work?
3. What's the deployment status? (Success/Failed/Building)
4. What's the SSL certificate status?
5. What happens when you try to access the site? (timeout, error page, blank page?)

