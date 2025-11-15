# Fix 522 Error for www Subdomain (Domain Transferred to Cloudflare)

## Situation
- Domain `vinaygautam.com` (root) was transferred from Namecheap to Cloudflare
- `www.vinaygautam.com` is a subdomain that needs to point to Pages
- Pages URL works, but custom domain gives 522 error

## Key Point
When a domain is transferred to Cloudflare, `www` is treated as a subdomain. The DNS record name should be just `www`, not the full domain.

## Step-by-Step Fix

### Step 1: Verify Current DNS Records

1. **Go to DNS → Records**:
   - Cloudflare Dashboard → Domain `vinaygautam.com` → **"DNS"** → **"Records"**

2. **Check what you have**:
   - Look for a CNAME record with Name `www`
   - Should show:
     - Type: CNAME
     - Name: `www`
     - Content/Target: `vinaygautam-blog.pages.dev`
     - Proxy: Proxied (orange cloud) ✅

3. **If the record doesn't exist or is wrong**:
   - Delete any incorrect `www` records
   - Create a new one (see Step 2)

### Step 2: Create/Edit CNAME Record for www

1. **Add or Edit Record**:
   - Click **"Add record"** (or click **"Edit"** on existing `www` record)

2. **Configure the Record**:
   - **Type**: `CNAME`
   - **Name**: `www` (just `www`, NOT `www.vinaygautam.com`)
     - Cloudflare automatically knows this is for `www.vinaygautam.com`
   - **Target**: `vinaygautam-blog.pages.dev`
     - Must match exactly (no trailing dot, no www prefix)
   - **Proxy status**: **Proxied** (orange cloud) ✅
     - This is critical - must be proxied, not DNS-only
   - **TTL**: Auto
   - Click **"Save"**

### Step 3: Remove and Re-add Domain in Pages

1. **Remove from Pages**:
   - Pages → `vinaygautam-blog` → **"Custom domains"**
   - Find `www.vinaygautam.com`
   - Click `...` → **"Remove"**
   - Confirm

2. **Wait 2 minutes**

3. **Re-add in Pages**:
   - Click **"Set up a custom domain"**
   - Enter: `www.vinaygautam.com` (with www)
   - Click **"Continue"**

4. **Cloudflare should detect the CNAME**:
   - It should show the DNS record you just created
   - Click **"Check DNS records"**
   - Wait for status to become "Active"

### Step 4: Wait for SSL and Test

1. **Wait 5-10 minutes**:
   - SSL certificate needs to be provisioned
   - Check SSL/TLS → Edge Certificates
   - Status should change to "Active"

2. **Test the site**:
   - Visit: `https://www.vinaygautam.com`
   - Should work after SSL is active

## Common Mistakes to Avoid

❌ **Wrong**: Name = `www.vinaygautam.com` (full domain)
✅ **Correct**: Name = `www` (just the subdomain)

❌ **Wrong**: Target = `www.vinaygautam-blog.pages.dev`
✅ **Correct**: Target = `vinaygautam-blog.pages.dev`

❌ **Wrong**: Proxy = DNS only (gray cloud)
✅ **Correct**: Proxy = Proxied (orange cloud)

## Verification Checklist

After setup, verify:

- [ ] CNAME record exists with Name = `www`
- [ ] Target = `vinaygautam-blog.pages.dev` (exact match)
- [ ] Proxy status = Proxied (orange cloud)
- [ ] Domain shows "Active" in Pages
- [ ] SSL certificate is Active (not Pending)
- [ ] Site loads at `https://www.vinaygautam.com`

## If Still Getting 522 Error

1. **Double-check DNS record**:
   - Name must be exactly `www` (not `www.vinaygautam.com`)
   - Target must be exactly `vinaygautam-blog.pages.dev`
   - Proxy must be enabled (orange cloud)

2. **Check Pages project name**:
   - Verify your Pages project is actually named `vinaygautam-blog`
   - Check in Pages dashboard → Settings

3. **Try accessing root domain**:
   - If you also added `vinaygautam.com` (without www) to Pages
   - Test: `https://vinaygautam.com`
   - This might work even if www doesn't

4. **Contact Cloudflare support**:
   - If everything looks correct but still 522
   - There might be a routing issue on Cloudflare's side

