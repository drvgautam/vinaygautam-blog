# Fix: Root Domain DNS Record Name

## Current Issue

You have:
- ❌ CNAME `vinaygautam.com` → `vinaygautam-blog.pages.dev` (Proxied)
- ✅ CNAME `www` → `vinaygautam-blog.pages.dev` (Proxied)

## Problem

The root domain record should use `@` (or be blank), **not** the full domain name `vinaygautam.com`.

Using the full domain name can cause issues with:
- Redirect rules not matching properly
- DNS resolution problems
- Cloudflare not recognizing it as the root domain

## Solution: Change Record Name to `@`

### Step 1: Delete the Incorrect Record

1. Go to **Cloudflare Dashboard** → Select `vinaygautam.com` → **DNS** → **Records**
2. Find the record with:
   - **Type**: `CNAME`
   - **Name**: `vinaygautam.com`
   - **Target**: `vinaygautam-blog.pages.dev`
3. Click the **three dots** (⋯) or **pencil icon** next to the record
4. Click **"Delete"** and confirm

### Step 2: Add Correct Root Domain Record

1. Click **"Add record"** button
2. Configure:
   - **Type**: `CNAME`
   - **Name**: `@` (or leave blank - both represent root domain)
   - **Target**: `vinaygautam-blog.pages.dev`
   - **Proxy status**: **Proxied** (orange cloud) ✅
   - **TTL**: Auto
3. Click **"Save"**

### Step 3: Verify Your Records

After the change, you should have:

```
Type    Name    Target                        Proxy
CNAME   @       vinaygautam-blog.pages.dev    Proxied ✅
CNAME   www     vinaygautam-blog.pages.dev    Proxied ✅
```

### Step 4: Wait and Test

1. **Wait 1-2 minutes** for DNS to update
2. **Clear Cloudflare cache**:
   - Go to **Caching** → **Configuration**
   - Click **"Purge Everything"**
3. **Test in incognito mode**:
   - Visit: `http://vinaygautam.com/`
   - Should redirect to: `https://www.vinaygautam.com/`

## Why This Matters

- `@` is the standard DNS notation for the root domain
- Cloudflare's redirect rules expect the root domain record to be named `@`
- Using the full domain name can cause the redirect rule to not match correctly

## After Fixing

Your DNS records should look like this:

```
Type    Name    Content                        Proxy Status
CNAME   @       vinaygautam-blog.pages.dev     Proxied (orange cloud)
CNAME   www     vinaygautam-blog.pages.dev     Proxied (orange cloud)
```

And your Page Rule:
- **Pattern**: `vinaygautam.com/*`
- **Action**: Forwarding URL (301) to `https://www.vinaygautam.com/$1`

This should make the redirect work properly!

