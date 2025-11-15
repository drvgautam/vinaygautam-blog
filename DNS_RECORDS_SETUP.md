# DNS Records Setup for vinaygautam.com

## Required DNS Records

For your domain to work properly with Cloudflare Pages, you need **TWO DNS records**:

### Record 1: CNAME for www subdomain

**Purpose**: Makes `www.vinaygautam.com` point to your Cloudflare Pages site

**Configuration**:
- **Type**: `CNAME`
- **Name**: `www`
- **Target**: `vinaygautam-blog.pages.dev` (or your actual Pages URL)
- **Proxy status**: Proxied (orange cloud) ✅
- **TTL**: Auto

**How to add**:
1. Go to Cloudflare Dashboard
2. Select domain `vinaygautam.com`
3. Go to **"DNS"** → **"Records"**
4. Click **"Add record"**
5. Fill in the fields above
6. Click **"Save"**

### Record 2: A record for root domain (apex)

**Purpose**: Makes `vinaygautam.com` (without www) accessible so it can redirect to www

**Configuration**:
- **Type**: `A`
- **Name**: `@` (or leave blank - represents root domain)
- **IPv4 address**: `192.0.2.1` (placeholder - see notes below)
- **Proxy status**: Proxied (orange cloud) ✅
- **TTL**: Auto

**Important Notes**:
- The actual IP address doesn't matter much because Cloudflare's proxy (orange cloud) handles the routing
- When you add the root domain in Cloudflare Pages, it may show you a specific IP to use
- Alternatively, Cloudflare may automatically create this record
- The proxy ensures all traffic goes through Cloudflare's network

**How to add**:
1. In the same DNS Records page
2. Click **"Add record"** again
3. Select **Type**: `A`
4. **Name**: `@` (or leave blank)
5. **IPv4 address**: Use the IP shown in Cloudflare Pages, or `192.0.2.1` as placeholder
6. **Proxy status**: Proxied (orange cloud) ✅
7. Click **"Save"**

## Alternative: Adding Root Domain in Cloudflare Pages

Instead of manually creating the A record, you can:

1. **Add root domain in Pages**:
   - In your Pages project → **"Custom domains"** tab
   - Click **"Set up a custom domain"**
   - Enter: `vinaygautam.com` (without www)
   - Cloudflare will automatically create the necessary DNS record
   - It may show you an A record or use CNAME flattening

2. **This approach is recommended** because:
   - Cloudflare handles the DNS automatically
   - It ensures the record is correct
   - Easier to manage

## Complete DNS Setup Summary

After setup, you should have:

```
Type    Name    Content/Target                    Proxy
CNAME   www     vinaygautam-blog.pages.dev        ✅ Proxied
A       @       192.0.2.1 (or Pages-provided IP) ✅ Proxied
```

## Verification

1. **Check DNS records**:
   - Go to DNS → Records
   - Verify both records exist
   - Both should have orange cloud (proxied)

2. **Test www subdomain**:
   - Visit: `https://www.vinaygautam.com`
   - Should load your site

3. **Test root domain**:
   - Visit: `https://vinaygautam.com`
   - Should redirect to `https://www.vinaygautam.com` (if redirect rule is set up)

## Troubleshooting

**Root domain not working?**
- Ensure the A record exists for `@`
- Check proxy status is enabled (orange cloud)
- Wait a few minutes for DNS propagation
- Verify the record was created correctly

**Both records needed?**
- Yes! The CNAME for `www` serves your site
- The A record for `@` allows the root domain to be accessible (for redirects)

**Can I use CNAME for root domain?**
- Traditional DNS doesn't allow CNAME at root
- Cloudflare supports "CNAME flattening" which allows this
- When adding root domain in Pages, Cloudflare may use this automatically

