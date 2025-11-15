# Fix 522 Error: Site Works on Pages URL but Not Custom Domain

## Problem
- ✅ `https://vinaygautam-blog.pages.dev` works fine
- ❌ `https://www.vinaygautam.com` gives 522 error
- DNS status shows "Active"
- **Important**: Domain `vinaygautam.com` (root) was transferred from Namecheap to Cloudflare

## Root Cause
The custom domain isn't properly connected to the Pages deployment, even though DNS is correct. Since the root domain is the primary domain in Cloudflare, the `www` subdomain needs special handling.

## Solution Steps

### Step 1: Verify Domain Connection in Pages

1. **Go to Pages Dashboard**:
   - Navigate to: `vinaygautam-blog` project
   - Go to **"Custom domains"** tab

2. **Check domain status**:
   - Look at `www.vinaygautam.com` status
   - Should show "Active" (green)
   - If it shows "Pending" or "Inactive", that's the issue

3. **If status is not "Active"**:
   - Click on the domain
   - Click **"Check DNS records"** again
   - Wait 2-3 minutes
   - Refresh the page

### Step 2: Remove and Re-add Domain

If the domain shows "Active" but still gives 522 error:

1. **Remove the domain**:
   - In Pages → Custom domains
   - Find `www.vinaygautam.com`
   - Click the three dots `...` menu
   - Click **"Remove"** or **"Delete"**
   - Confirm removal

2. **Wait 1-2 minutes**

3. **Re-add the domain**:
   - Click **"Set up a custom domain"**
   - Enter: `www.vinaygautam.com`
   - Click **"Continue"**

4. **Verify DNS**:
   - Cloudflare should detect the existing CNAME record
   - Click **"Check DNS records"**
   - Wait for status to become "Active"

5. **Wait 5-10 minutes** for SSL certificate provisioning

### Step 3: Verify DNS Record Target

1. **Go to DNS → Records**:
   - Check the CNAME record for `www`
   - **Name should be exactly**: `www` (not `www.vinaygautam.com`)
   - **Target should be exactly**: `vinaygautam-blog.pages.dev` (no trailing dot)
   - **Proxy status**: Proxied (orange cloud) ✅

2. **If target is different or missing**:
   - Edit the record (or create new if missing)
   - **Type**: `CNAME`
   - **Name**: `www` (just `www`, not the full domain)
   - **Target**: `vinaygautam-blog.pages.dev`
   - **Proxy**: Proxied (orange cloud) ✅
   - Save

3. **Important for transferred domains**:
   - Since `vinaygautam.com` is the primary domain in Cloudflare
   - The `www` subdomain is just `www` in the Name field
   - Cloudflare automatically appends the root domain

### Step 4: Check SSL Certificate

1. **Go to SSL/TLS**:
   - Domain `vinaygautam.com` → **"SSL/TLS"** → **"Edge Certificates"**

2. **Check certificate**:
   - Look for `www.vinaygautam.com`
   - Status should be **"Active"**
   - If "Pending", wait 10-15 minutes

3. **Enable settings**:
   - **"Always Use HTTPS"**: ON ✅
   - **"Automatic HTTPS Rewrites"**: ON ✅

### Step 5: Force SSL Certificate Provisioning

If SSL is pending:

1. **Go to Pages**:
   - Custom domains tab
   - Click on `www.vinaygautam.com`
   - Look for SSL certificate status

2. **If stuck on "Pending"**:
   - Remove the domain
   - Wait 2 minutes
   - Add it back
   - This triggers certificate provisioning again

### Step 6: Verify Pages Project Settings

1. **Check project settings**:
   - Pages → `vinaygautam-blog` → **"Settings"** tab
   - Verify **"Production branch"** is `main`
   - Check **"Build output directory"** is `dist`

2. **Check latest deployment**:
   - Go to **"Deployments"** tab
   - Latest deployment should be **"Success"**
   - If not, check build logs

## Alternative: Check Domain in Pages API

Sometimes the domain needs to be re-verified at a lower level:

1. **Try accessing via different protocol**:
   - Try: `http://www.vinaygautam.com` (should redirect to https)
   - Try: `https://vinaygautam.com` (should redirect to www)

2. **Check if root domain works**:
   - If you added `vinaygautam.com` (without www) to Pages
   - Test: `https://vinaygautam.com`
   - This might work even if www doesn't

## Most Common Fix

**The most common solution is Step 2: Remove and re-add the domain**

This forces Cloudflare Pages to:
- Re-verify the DNS connection
- Re-provision the SSL certificate
- Re-establish the routing between domain and deployment

## Quick Test After Fix

After re-adding the domain:

1. Wait 5-10 minutes
2. Test: `https://www.vinaygautam.com`
3. If still 522, wait another 5 minutes (SSL provisioning)
4. Clear browser cache and try again

## If Still Not Working

Check these:

1. **DNS record target**:
   - Must be exactly: `vinaygautam-blog.pages.dev`
   - Not: `vinaygautam-blog.pages.dev.` (no trailing dot)
   - Not: `www.vinaygautam-blog.pages.dev`

2. **Proxy status**:
   - Must be Proxied (orange cloud)
   - Not DNS only (gray cloud)

3. **Pages project name**:
   - Verify your Pages project is actually named `vinaygautam-blog`
   - Check in Pages dashboard

4. **Multiple domains**:
   - If you have both `vinaygautam.com` and `www.vinaygautam.com` in Pages
   - Make sure both are properly configured
   - Try removing both and adding only `www.vinaygautam.com` first

