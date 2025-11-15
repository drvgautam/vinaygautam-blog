# Deploy vinaygautam-blog to Cloudflare Pages

## Repository Information
- **Repository**: `drvgautam/vinaygautam-blog`
- **Visibility**: Public
- **Domain**: `www.vinaygautam.com`
- **Build Output**: `dist`

## Step-by-Step Deployment Instructions

### Step 1: Access Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sign in with your account
3. Click on **"Workers & Pages"** in the left sidebar
4. Click **"Create application"** button
5. Select **"Pages"** tab
6. Click **"Connect to Git"**

### Step 2: Connect GitHub Repository

1. **Select Git Provider**: Choose **GitHub**
2. **Authorize Cloudflare** (if not already done):
   - Click "Authorize Cloudflare"
   - Grant necessary permissions
   - You may need to install the Cloudflare Pages GitHub app

3. **Select Repository**:
   - Search for or select: `vinaygautam-blog`
   - Click on the repository

### Step 3: Configure Build Settings

1. **Project name**: `vinaygautam-blog` (or your preferred name)

2. **Production branch**: `main`

3. **Build settings**:
   - **Framework preset**: `Astro` (or leave as "None")
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty - it's at the root)
   - **Environment variables**: (none needed for this project)

4. Click **"Save and Deploy"**

### Step 4: Wait for Initial Build

- Cloudflare will automatically:
  - Install dependencies (`npm install`)
  - Run the build (`npm run build`)
  - Deploy to a preview URL (e.g., `vinaygautam-blog.pages.dev`)

- Monitor the build in the Cloudflare dashboard
- Wait for the build to complete (usually 2-5 minutes)

### Step 5: Add Custom Domain

1. **Go to Custom domains**:
   - In your Pages project, click on **"Custom domains"** tab
   - Click **"Set up a custom domain"**

2. **Add Domains**:
   - **First, add www subdomain**:
     - Enter: `www.vinaygautam.com`
     - Click **"Continue"**
     - Cloudflare will show you the DNS record needed (CNAME for `www`)
   
   - **Then, optionally add root domain** (for redirect setup):
     - Click **"Set up a custom domain"** again
     - Enter: `vinaygautam.com` (without www)
     - Click **"Continue"**
     - Cloudflare may show you an A record or CNAME flattening option
     - This allows the root domain to be accessible for redirects

3. **Configure DNS Records**:
   
   You need **TWO DNS records** for the domain to work properly:
   
   **Record 1: CNAME for www subdomain**
   - Go to Cloudflare Dashboard → Select domain `vinaygautam.com`
   - Go to **"DNS"** → **"Records"**
   - Click **"Add record"**
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: Your Cloudflare Pages URL (e.g., `vinaygautam-blog.pages.dev`)
   - **Proxy status**: Proxied (orange cloud) ✅
   - Click **"Save"**
   
   **Record 2: A record for root domain (apex)**
   - Still in DNS Records, click **"Add record"** again
   - **Type**: `A`
   - **Name**: `@` (or leave blank - represents root domain)
   - **IPv4 address**: `192.0.2.1` (this is a placeholder - Cloudflare will handle it)
   - **Proxy status**: Proxied (orange cloud) ✅
   - Click **"Save"**
   
   **Important Note**: 
   - The A record for the root domain is needed so that `vinaygautam.com` can be accessed (even if just to redirect to www)
   - Cloudflare's proxy will handle the actual routing
   - If Cloudflare shows a specific IP when adding the root domain in Pages, use that instead
   - Alternatively, Cloudflare may automatically create this record when you add the root domain in Pages

4. **SSL/TLS**:
   - Cloudflare will automatically provision an SSL certificate
   - This may take a few minutes to 24 hours
   - Check status in **SSL/TLS** → **Edge Certificates**

### Step 6: Set Up Redirect (non-www to www)

Cloudflare offers two methods for redirects. **Redirect Rules** (recommended) is the newer, more flexible option. If it's not available, use **Page Rules**.

#### Option A: Using Redirect Rules (Recommended - Newer Method)

1. **Navigate to Redirect Rules**:
   - In Cloudflare Dashboard, select your domain `vinaygautam.com`
   - In the left sidebar, click **"Rules"**
   - Click on **"Redirect Rules"** (under the Rules section)
   - If you don't see "Redirect Rules", you may need to use Page Rules (see Option B below)

2. **Create a New Redirect Rule**:
   - Click the **"Create rule"** button (usually at the top right)
   - You'll see a form with several fields

3. **Configure the Rule**:
   
   **Rule Name** (optional but recommended):
   - Enter: `Redirect non-www to www`
   - This helps you identify the rule later
   
   **If the incoming request matches**:
   - Select **"Custom filter expression"** or **"URL path"** depending on what's available
   - Enter the condition: `(http.host eq "vinaygautam.com")`
     - This matches requests to `vinaygautam.com` (without www)
   - OR if using a simpler interface, select:
     - **Hostname**: `vinaygautam.com`
     - **Path**: Leave empty or set to `/*` to match all paths
   
   **Then the action is**:
   - Select **"Redirect"** or **"Dynamic redirect"**
   - **Status code**: Select `301 - Permanent Redirect`
   - **Destination URL**: Enter `https://www.vinaygautam.com/$1`
     - The `$1` captures the path and query string
   - OR if there's a dropdown, select:
     - **Redirect to**: `https://www.vinaygautam.com`
     - **Preserve path**: Yes/Enabled
     - **Preserve query string**: Yes/Enabled

4. **Deploy the Rule**:
   - Review your settings
   - Click **"Deploy"** or **"Save"** button
   - The rule will be active immediately

5. **Verify the Rule**:
   - You should see the rule listed in the Redirect Rules page
   - Test by visiting `http://vinaygautam.com` (should redirect to `https://www.vinaygautam.com`)
   - Test with a path: `http://vinaygautam.com/blog` (should redirect to `https://www.vinaygautam.com/blog`)

#### Option B: Using Page Rules (Legacy Method)

If Redirect Rules are not available in your Cloudflare plan, use Page Rules:

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
   - This matches all URLs on `vinaygautam.com` (without www)
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
   - Page Rules are free for the first 3 rules, then require a paid plan

6. **Verify the Rule**:
   - The rule appears in your Page Rules list
   - Test by visiting `http://vinaygautam.com` (should redirect)
   - Note: Page Rules can take a few minutes to propagate

#### Detailed Example Configuration

**For Redirect Rules (Option A)**:
```
Rule Name: Redirect non-www to www
Condition: (http.host eq "vinaygautam.com")
Action: Dynamic redirect
Status Code: 301
Destination: https://www.vinaygautam.com${http.request.uri.path}${http.request.uri.query}
```

**For Page Rules (Option B)**:
```
URL Pattern: vinaygautam.com/*
Setting: Forwarding URL
Status Code: 301 - Permanent Redirect
Destination: https://www.vinaygautam.com/$1
```

#### Testing the Redirect

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

4. **Check HTTP status**:
   - Use a tool like `curl` or browser dev tools
   - Should return `301 Moved Permanently`
   - Location header should be `https://www.vinaygautam.com/...`

#### Troubleshooting Redirect Rules

**Redirect not working?**
- Wait 1-2 minutes for propagation (especially Page Rules)
- Clear browser cache or use incognito mode
- Check rule is active/enabled in the dashboard
- Verify DNS is using Cloudflare (orange cloud icon)
- Check rule order (Redirect Rules are processed in order)

**Infinite redirect loop?**
- Make sure the destination URL is different from the source
- Don't redirect `www.vinaygautam.com` to itself
- Check for conflicting rules

**Path not preserved?**
- Verify you're using `$1` or `${http.request.uri.path}` correctly
- For Page Rules, ensure the pattern includes `/*`
- For Redirect Rules, check the expression syntax

### Step 7: Verify Deployment

1. **Check Build Status**:
   - Go to Pages project → **"Deployments"** tab
   - Verify latest deployment shows "Success"

2. **Test the Site**:
   - Visit `https://www.vinaygautam.com`
   - Verify all pages load correctly
   - Test navigation links
   - Check that DatumInt link opens `https://www.datumint.no`

3. **Verify SSL**:
   - Check that the site loads with HTTPS
   - SSL certificate should be active

## Build Configuration Summary

```
Repository: drvgautam/vinaygautam-blog
Branch: main
Build command: npm run build
Output directory: dist
Node version: Auto-detected (or specify if needed)
```

## Troubleshooting

### Build Fails

1. **Check build logs** in Cloudflare Pages dashboard
2. **Common issues**:
   - Missing dependencies → Check `package.json`
   - Build errors → Check Astro configuration
   - Node version → May need to specify in build settings

### Domain Not Working

1. **Check DNS records**:
   - Verify CNAME record exists
   - Ensure it points to correct Pages URL
   - Check proxy status (should be orange cloud)

2. **Check SSL certificate**:
   - Go to SSL/TLS → Edge Certificates
   - Wait for certificate provisioning (up to 24 hours)
   - Ensure "Always Use HTTPS" is enabled

### Site Not Updating

1. **Trigger new deployment**:
   - Push a new commit to `main` branch
   - Or manually trigger rebuild in Cloudflare dashboard

2. **Clear cache**:
   - Go to Caching → Configuration
   - Click "Purge Everything"

## Important Notes

- The repository is **public**, so all blog/portfolio content is visible
- The consultancy site (`datumint-consultancy`) is in a **separate private repository**
- Both sites are deployed independently on Cloudflare Pages
- The DatumInt link in the navbar points to the external consultancy site

## Verification Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build completes successfully
- [ ] Custom domain `www.vinaygautam.com` added
- [ ] DNS records configured correctly
- [ ] SSL certificate active
- [ ] Site accessible at `https://www.vinaygautam.com`
- [ ] Redirect from `vinaygautam.com` to `www.vinaygautam.com` works
- [ ] All pages load correctly
- [ ] DatumInt link works (opens external site)

## Support

If you encounter any issues:
1. Check Cloudflare Pages build logs
2. Verify DNS settings in Cloudflare dashboard
3. Check SSL/TLS certificate status
4. Review Astro build output locally: `npm run build`

