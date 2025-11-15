# Fix: Redirect Rule Not Working

## Problem
Page Rule is configured:
- Pattern: `vinaygautam.com/*`
- Action: Forwarding URL (301) to `https://www.vinaygautam.com/$1`

But visiting `http://vinaygautam.com/` does NOT redirect to `www.vinaygautam.com`.

## Common Causes & Solutions

### 1. Check DNS Record for Root Domain

**The root domain MUST have a DNS record that's Proxied (orange cloud) for the redirect to work.**

1. Go to Cloudflare Dashboard → Select `vinaygautam.com` → **DNS** → **Records**

2. **Check for root domain record**:
   - Look for a record with **Name**: `@` (or blank)
   - **Type**: Should be `CNAME` or `A`
   - **Target**: Should point to `vinaygautam-blog.pages.dev` (for CNAME) or an IP (for A)
   - **Proxy status**: MUST be **Proxied** (orange cloud icon) ✅
     - If it shows "DNS only" (gray cloud), click the cloud icon to toggle to "Proxied"

3. **If the record doesn't exist, add it**:
   - Click **"Add record"**
   - **Type**: `CNAME`
   - **Name**: `@` (or leave blank)
   - **Target**: `vinaygautam-blog.pages.dev`
   - **Proxy status**: **Proxied** (orange cloud) ✅
   - **TTL**: Auto
   - Click **"Save"**

**Why this matters**: If the root domain isn't proxied through Cloudflare, Cloudflare can't intercept the request to apply the redirect rule.

### 2. Verify Page Rule is Active

1. Go to **Rules** → **Page Rules**
2. Find your rule: `vinaygautam.com/*`
3. Check:
   - ✅ Rule is **enabled** (not paused/disabled)
   - ✅ Rule is at the **top** of the list (rules are processed in order)
   - ✅ No conflicting rules above it

4. **If rule is disabled**:
   - Click on the rule
   - Make sure it's enabled
   - Click **"Save and Deploy"**

### 3. Check SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. **Encryption mode**: Should be **"Full"** or **"Full (strict)"**
   - Not "Flexible" (this can cause issues)

3. Go to **SSL/TLS** → **Edge Certificates**
4. Check:
   - ✅ **"Always Use HTTPS"** is enabled
   - ✅ **"Automatic HTTPS Rewrites"** is enabled

### 4. Verify Root Domain is Connected to Cloudflare

The root domain needs to be accessible through Cloudflare for the redirect to work.

**Check if root domain is added to Pages** (optional but recommended):
1. Go to **Workers & Pages** → Your project → **Custom domains**
2. Check if `vinaygautam.com` (without www) is listed
3. If not, you can add it (it won't serve content if you have the redirect rule)

**Note**: You don't necessarily need to add the root domain to Pages if you have the redirect rule, but the DNS record must be proxied.

### 5. Clear Cache and Test

1. **Clear Cloudflare cache**:
   - Go to **Caching** → **Configuration**
   - Click **"Purge Everything"**

2. **Test in incognito/private mode**:
   - Browsers cache redirects, so use incognito mode
   - Visit: `http://vinaygautam.com/`
   - Should redirect to: `https://www.vinaygautam.com/`

3. **Test with curl** (to bypass browser cache):
   ```bash
   curl -I http://vinaygautam.com/
   ```
   Should show:
   ```
   HTTP/1.1 301 Moved Permanently
   Location: https://www.vinaygautam.com/
   ```

### 6. Check Rule Priority

Page Rules are processed in order (top to bottom). If you have multiple rules:

1. Make sure the `vinaygautam.com/*` rule is **at the top**
2. If there's a conflicting rule above it, either:
   - Delete the conflicting rule, OR
   - Move your redirect rule above it

### 7. Verify Rule Syntax

Double-check your Page Rule configuration:

**Correct configuration**:
- **URL Pattern**: `vinaygautam.com/*`
  - ✅ No `http://` or `https://`
  - ✅ Includes `/*` to match all paths
- **Setting**: Forwarding URL
- **Status Code**: 301 - Permanent Redirect
- **Destination URL**: `https://www.vinaygautam.com/$1`
  - ✅ Includes `https://`
  - ✅ Includes `$1` to preserve path

**Common mistakes**:
- ❌ Pattern: `http://vinaygautam.com/*` (should not include protocol)
- ❌ Pattern: `vinaygautam.com` (missing `/*`)
- ❌ Destination: `www.vinaygautam.com/$1` (missing `https://`)

### 8. Wait for Propagation

Page Rules can take **2-5 minutes** to propagate globally. If you just created the rule:
- Wait 5 minutes
- Clear cache
- Test again in incognito mode

## Step-by-Step Fix (Most Likely Issue)

Based on the problem description, the **most likely issue** is that the root domain DNS record is missing or not proxied.

### Quick Fix:

1. **Go to DNS Records**:
   - Cloudflare Dashboard → `vinaygautam.com` → **DNS** → **Records**

2. **Check for root domain record**:
   - Look for record with Name: `@` (or blank)
   - If it exists but is "DNS only" (gray cloud):
     - Click the cloud icon to make it **Proxied** (orange cloud)
   - If it doesn't exist:
     - Click **"Add record"**
     - Type: `CNAME`
     - Name: `@`
     - Target: `vinaygautam-blog.pages.dev`
     - Proxy: **Proxied** ✅
     - Save

3. **Wait 1-2 minutes** for DNS to update

4. **Test in incognito mode**:
   - Visit `http://vinaygautam.com/`
   - Should redirect to `https://www.vinaygautam.com/`

## Verification Checklist

After applying fixes, verify:

- [ ] DNS record for `@` exists and is **Proxied** (orange cloud)
- [ ] Page Rule is **enabled** and at the top of the list
- [ ] Page Rule pattern is: `vinaygautam.com/*`
- [ ] Page Rule destination is: `https://www.vinaygautam.com/$1`
- [ ] SSL/TLS mode is "Full" or "Full (strict)"
- [ ] "Always Use HTTPS" is enabled
- [ ] Cloudflare cache is cleared
- [ ] Tested in incognito mode

## Still Not Working?

If after all these steps it still doesn't work:

1. **Delete and recreate the Page Rule**:
   - Delete the existing rule
   - Wait 2 minutes
   - Create a new rule with the exact same settings
   - Wait 5 minutes
   - Test again

2. **Check Cloudflare status**:
   - Make sure your domain is fully active in Cloudflare
   - Check for any warnings or errors in the dashboard

3. **Contact Cloudflare support**:
   - If everything looks correct but it still doesn't work, there might be an account-level issue

