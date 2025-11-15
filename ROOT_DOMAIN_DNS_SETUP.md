# Setting Up Root Domain (vinaygautam.com) DNS Record

## Current Situation

You've added `vinaygautam.com` (root domain) in Cloudflare Pages, and it's showing "Verifying" status. You need to add the A record for the root domain.

## Step-by-Step Instructions

### 1. Check What Cloudflare Pages Shows

1. In your Pages project → **"Custom domains"** tab
2. Click on the **"> Complete DNS setup"** link next to `vinaygautam.com`
3. Cloudflare should show you:
   - The exact DNS record type needed (A or CNAME)
   - The exact IP address or target to use
   - Copy this information

### 2. Add the A Record

1. **Go to DNS Records**:
   - Click on your domain `vinaygautam.com` (from domain list)
   - Go to **"DNS"** → **"Records"**

2. **Add A Record**:
   - Click **"Add record"**
   - **Type**: `A`
   - **Name**: `@` (or leave blank - this represents the root domain)
   - **IPv4 address**: 
     - **Use the IP shown in Pages** (from step 1)
     - OR if not shown, use: `192.0.2.1`
   - **Proxy status**: **Proxied** (orange cloud) ✅
   - **TTL**: Auto
   - Click **"Save"**

### 3. Verify in Pages

1. Go back to Pages → **"Custom domains"** tab
2. Click **"Check DNS records"** button
3. Wait 1-2 minutes
4. Status should change from "Verifying" to "Active"

## If Cloudflare Uses CNAME Flattening

Some Cloudflare accounts automatically use CNAME flattening for root domains. In this case:

1. **Check if CNAME is allowed**:
   - Try adding a CNAME record instead of A record
   - **Type**: `CNAME`
   - **Name**: `@` (or blank)
   - **Target**: `vinaygautam-blog.pages.dev`
   - **Proxy**: Proxied ✅

2. **Cloudflare will automatically flatten it** to work at the root domain

## Common IP Addresses for Cloudflare Pages

If Cloudflare doesn't show a specific IP, you can use:
- `192.0.2.1` (most common placeholder)
- `198.41.214.162` (Cloudflare anycast IP)

**Important**: When proxy is enabled (orange cloud), the actual IP address is less critical because Cloudflare routes all traffic through their network.

## Troubleshooting "Verifying" Status

If status remains "Verifying":

1. **Check the record exists**:
   - Go to DNS → Records
   - Verify you see an A record for `@` (or blank name)
   - Ensure it's Proxied (orange cloud)

2. **Check the IP address**:
   - If Pages showed a specific IP, make sure you used that exact one
   - If using a placeholder, ensure proxy is enabled

3. **Wait and retry**:
   - Wait 2-3 minutes after adding the record
   - Click "Check DNS records" again in Pages
   - Refresh the page

4. **Alternative: Use CNAME**:
   - Delete the A record
   - Add a CNAME record instead:
     - Type: CNAME
     - Name: `@`
     - Target: `vinaygautam-blog.pages.dev`
     - Proxy: Proxied ✅

## Why Root Domain Needs a Record

- The root domain (`vinaygautam.com`) needs a DNS record to be accessible
- Even if you're just redirecting it to www, the domain must resolve first
- The redirect rule (from Step 6) will then redirect `vinaygautam.com` → `www.vinaygautam.com`

## Final DNS Records Summary

After setup, you should have:

```
Type    Name    Content/Target                    Proxy    Purpose
CNAME   www     vinaygautam-blog.pages.dev        ✅        Serves www site
A       @       192.0.2.1 (or Pages-provided)   ✅        Allows root domain access
```

Both records should be **Proxied** (orange cloud) for proper routing.

