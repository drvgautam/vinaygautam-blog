# Quick Guide: Set Up Redirect from vinaygautam.com to www.vinaygautam.com

## Prerequisites Check

Before setting up the redirect, make sure you have:

1. ✅ `www.vinaygautam.com` added to Cloudflare Pages (already done)
2. ✅ DNS record for `www` pointing to `vinaygautam-blog.pages.dev` (Proxied)
3. ⚠️ **DNS record for root domain (`@`)** - This is needed for the redirect to work

## Step 1: Verify/Add Root Domain DNS Record

The root domain needs a DNS record so Cloudflare can intercept requests and redirect them.

1. **Go to Cloudflare Dashboard**
   - Select your domain `vinaygautam.com`
   - Click **"DNS"** → **"Records"**

2. **Check if you have a record for root domain**:
   - Look for a record with **Name**: `@` (or blank)
   - If it exists, make sure it's **Proxied** (orange cloud icon)
   - If it doesn't exist, add it:

3. **Add CNAME for Root Domain** (if missing):
   - Click **"Add record"**
   - **Type**: `CNAME`
   - **Name**: `@` (or leave blank - represents root domain)
   - **Target**: `vinaygautam-blog.pages.dev`
   - **Proxy status**: **Proxied** (orange cloud) ✅
   - **TTL**: Auto
   - Click **"Save"**

   **Note**: Cloudflare supports CNAME flattening, so you can use CNAME for the root domain even though traditionally it required an A record.

## Step 2: Set Up Redirect Rule

### Option A: Redirect Rules (Recommended - Newer Method)

1. **Navigate to Redirect Rules**:
   - In Cloudflare Dashboard, select your domain `vinaygautam.com`
   - In the left sidebar, click **"Rules"**
   - Click on **"Redirect Rules"** (under the Rules section)

2. **Create a New Redirect Rule**:
   - Click the **"Create rule"** button (usually at the top right)

3. **Configure the Rule**:
   
   **Rule Name** (optional):
   - Enter: `Redirect non-www to www`
   
   **If the incoming request matches**:
   - You'll see a condition builder. Select:
     - **Field**: `Hostname`
     - **Operator**: `equals`
     - **Value**: `vinaygautam.com`
   
   **Then the action is**:
   - **Action**: Select **"Redirect"** or **"Dynamic redirect"**
   - **Status code**: `301 - Permanent Redirect`
   - **Destination URL**: `https://www.vinaygautam.com${http.request.uri.path}${http.request.uri.query}`
     - OR if there's a simpler field, enter: `https://www.vinaygautam.com/$1`
     - Make sure "Preserve path" and "Preserve query string" are enabled

4. **Deploy the Rule**:
   - Review your settings
   - Click **"Deploy"** or **"Save"** button
   - The rule will be active immediately (or within 1-2 minutes)

### Option B: Page Rules (If Redirect Rules Not Available)

If you don't see "Redirect Rules" in your Cloudflare plan, use Page Rules:

1. **Navigate to Page Rules**:
   - In Cloudflare Dashboard, select your domain `vinaygautam.com`
   - In the left sidebar, click **"Rules"**
   - Click on **"Page Rules"**

2. **Create a New Page Rule**:
   - Click **"Create Page Rule"** button

3. **Configure the URL Pattern**:
   - In the **"If the URL matches"** field, enter:
     ```
     vinaygautam.com/*
     ```
   - Note: Don't include `http://` or `https://` in the pattern

4. **Set the Action**:
   - Click **"Add a Setting"** or look for **"Then the settings are"** section
   - Select **"Forwarding URL"**
   - Choose **"301 - Permanent Redirect"**
   - Enter the destination URL:
     ```
     https://www.vinaygautam.com/$1
     ```
   - The `$1` preserves the path (e.g., `/blog` becomes `/blog`)

5. **Save the Rule**:
   - Click **"Save and Deploy"**
   - Page Rules can take 2-5 minutes to propagate

## Step 3: Test the Redirect

After setting up the rule, test it:

1. **Test root domain**:
   - Visit: `http://vinaygautam.com`
   - Should redirect to: `https://www.vinaygautam.com`
   - Check browser address bar shows the www version

2. **Test with path**:
   - Visit: `http://vinaygautam.com/blog`
   - Should redirect to: `https://www.vinaygautam.com/blog`
   - Path should be preserved

3. **Test with query string**:
   - Visit: `http://vinaygautam.com/blog?page=1`
   - Should redirect to: `https://www.vinaygautam.com/blog?page=1`
   - Query string should be preserved

4. **Use incognito/private mode**:
   - Sometimes browsers cache redirects, so test in incognito mode

## Troubleshooting

### Redirect Not Working?

1. **Wait 1-2 minutes**: Redirect Rules are usually instant, but Page Rules can take a few minutes
2. **Check DNS**: Make sure the root domain (`@`) has a DNS record (CNAME) that's Proxied
3. **Clear browser cache**: Or use incognito mode
4. **Check rule status**: In the dashboard, verify the rule is active/enabled
5. **Verify DNS is using Cloudflare**: The DNS record should show orange cloud (Proxied)

### Infinite Redirect Loop?

- Make sure the destination URL is different from the source
- Don't redirect `www.vinaygautam.com` to itself
- Check for conflicting rules

### Path Not Preserved?

- For Page Rules, ensure the pattern includes `/*`
- For Redirect Rules, check that you're using `${http.request.uri.path}` or `$1` correctly

## Summary

**What you need**:
1. ✅ DNS record for `@` (root domain) → `vinaygautam-blog.pages.dev` (Proxied)
2. ✅ Redirect Rule: `vinaygautam.com/*` → `https://www.vinaygautam.com/$1` (301)

**Result**:
- `www.vinaygautam.com` → Serves your site ✅
- `vinaygautam.com` → Redirects to `www.vinaygautam.com` ✅

