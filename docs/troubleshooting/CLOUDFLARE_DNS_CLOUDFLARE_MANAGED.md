# Adding DNS Records When DNS is Managed by Cloudflare

## Situation
Your DNS is already transferred to Cloudflare (from Namecheap), so you need to add DNS records **directly in Cloudflare's DNS dashboard**, not in an external DNS provider.

## Quick Steps

### 1. Add CNAME Record in Cloudflare DNS

1. **Go to Cloudflare DNS Dashboard**:
   - In Cloudflare Dashboard, click on your domain `vinaygautam.com` (from the main domain list)
   - Click **"DNS"** in the left sidebar
   - Click **"Records"** tab

2. **Add the CNAME Record**:
   - Click **"Add record"** button
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `vinaygautam-blog.pages.dev` (exactly as shown in Pages)
   - **Proxy status**: **Proxied** (orange cloud) ✅
   - Click **"Save"**

3. **Verify the Record**:
   - You should see the new CNAME record in the list
   - It should show:
     - Type: CNAME
     - Name: www
     - Content: vinaygautam-blog.pages.dev
     - Proxy: Proxied (orange cloud)

### 2. Return to Pages and Check DNS

1. **Go back to Pages**:
   - Navigate to your Pages project: `vinaygautam-blog`
   - Go to **"Custom domains"** tab

2. **Trigger Verification**:
   - Click the **"Check DNS records"** button
   - Cloudflare will verify the DNS record you just added

3. **Wait for Verification**:
   - Status should change from "Verifying" to "Active"
   - This usually takes 1-2 minutes
   - If it doesn't update, wait a bit longer and click "Check DNS records" again

## Common Issues

### Status Remains "Verifying" or "Inactive"

**Check these**:
1. ✅ Record name is exactly `www` (no `www.` or trailing dot)
2. ✅ Target matches exactly what Pages shows (case-sensitive)
3. ✅ Proxy status is enabled (orange cloud, not gray)
4. ✅ Record type is `CNAME` (not A record)
5. ✅ You're adding it to the correct domain (`vinaygautam.com`)

**Try**:
- Wait 2-3 minutes after adding the record
- Click "Check DNS records" button again
- Refresh the Pages dashboard

### Can't Find DNS Settings

**Navigation path**:
1. Cloudflare Dashboard home
2. Click on domain `vinaygautam.com` (from the list of domains)
3. Left sidebar → **"DNS"**
4. **"Records"** tab

**Direct URL format**:
```
https://dash.cloudflare.com/[account-id]/[domain-id]/dns
```

## Visual Guide

**What you should see in DNS Records**:

```
Type    Name    Content/Target                    Proxy    TTL
CNAME   www     vinaygautam-blog.pages.dev        ✅        Auto
```

**What Pages is looking for**:
- Name: `www`
- Target: `vinaygautam-blog.pages.dev`
- Must be proxied (orange cloud)

## After DNS is Verified

Once the status shows "Active":
- Your site will be accessible at `www.vinaygautam.com`
- SSL certificate will be provisioned automatically
- You can then set up the redirect rule for `vinaygautam.com` → `www.vinaygautam.com`

