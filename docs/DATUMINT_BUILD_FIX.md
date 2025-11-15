# Fix for DatumInt Build Error on Cloudflare Pages

## Problem
The build fails with:
```
failed to resolve "extends":"astro/tsconfigs/strict" in /opt/buildhome/repo/tsconfig.json
```

This happens because TypeScript is trying to resolve the root `tsconfig.json` instead of the one in the subdirectory.

## Solution

### Option 1: Update Cloudflare Pages Build Settings (Recommended)

In your Cloudflare Pages project settings, update:

1. **Root directory**: `public/datumint_consulting` ✅ (already set)
2. **Build command**: `cd public/datumint_consulting && npm install && npm run build`
3. **Build output directory**: `dist`
4. **Install command**: `cd public/datumint_consulting && npm install`

This ensures:
- Dependencies are installed in the subdirectory
- Build runs from the subdirectory
- TypeScript finds the correct `tsconfig.json`

### Option 2: Use Environment Variable (Alternative)

If Option 1 doesn't work, you can also try:

1. **Root directory**: `public/datumint_consulting`
2. **Build command**: `npm install && npm run build`
3. **Environment variables**:
   - `NODE_VERSION`: `22` (or your preferred version)
   - `NPM_FLAGS`: `--prefix public/datumint_consulting`

### Option 3: Move to Separate Repository

If the subdirectory approach continues to cause issues, consider:
1. Creating a separate repository for DatumInt
2. Deploying from that repository
3. This eliminates all subdirectory-related issues

## Current Status

✅ `tsconfig.json` added to `public/datumint_consulting/`
✅ `.cloudflare/pages.json` added (may not be used by Cloudflare UI settings)
⏳ **Action needed**: Update build command in Cloudflare Pages UI

## Steps to Fix

1. Go to Cloudflare Dashboard → Your DatumInt project
2. Go to **Settings** → **Builds & deployments**
3. Update **Build command** to:
   ```
   cd public/datumint_consulting && npm install && npm run build
   ```
4. Update **Install command** (if available) to:
   ```
   cd public/datumint_consulting && npm install
   ```
5. Save and retry deployment

## Verification

After updating, the build should:
- ✅ Install dependencies in the subdirectory
- ✅ Find `tsconfig.json` in the subdirectory
- ✅ Build successfully
- ✅ Output to `dist` directory

