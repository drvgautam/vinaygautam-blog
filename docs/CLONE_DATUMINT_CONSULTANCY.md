# Clone DatumInt Consultancy Repository Locally

## Current Situation

- ✅ The consultancy site was extracted to a **private GitHub repository**: `datumint-consultancy`
- ⚠️ There's a temporary copy in `/tmp/datumint-extract/` (may be cleaned up)
- 📍 You need to clone the private repository to a permanent location

## Clone the Private Repository

### Step 1: Choose a Location

Decide where you want to keep the consultancy site. Common locations:
- `~/Documents/datumint-consultancy`
- `~/Projects/datumint-consultancy`
- `~/dev/datumint-consultancy`

### Step 2: Clone the Repository

```bash
# Navigate to your preferred location
cd ~/Documents

# Clone the private repository
git clone https://github.com/drvgautam/datumint-consultancy.git

# Navigate into the repository
cd datumint-consultancy
```

### Step 3: Install Dependencies

```bash
# Install npm dependencies
npm install
```

### Step 4: Verify It Works

```bash
# Build the site
npm run build

# Preview locally (optional)
npm run preview
```

## Repository Information

- **Repository**: `drvgautam/datumint-consultancy`
- **Visibility**: Private
- **Remote URL**: `https://github.com/drvgautam/datumint-consultancy.git`

## Quick Setup Script

You can run this to clone and set it up:

```bash
# Clone to Documents folder
cd ~/Documents
git clone https://github.com/drvgautam/datumint-consultancy.git
cd datumint-consultancy
npm install
npm run build
echo "✅ DatumInt consultancy site cloned and ready!"
```

## Temporary Copy Location

If you need to reference the temporary extraction:
- **Location**: `/tmp/datumint-extract/`
- **Note**: This is a temporary directory and may be cleaned up by the system
- **Recommendation**: Clone the repository instead of using the temp copy

## Verify Remote

After cloning, verify the remote is set correctly:

```bash
cd ~/Documents/datumint-consultancy
git remote -v
```

Should show:
```
origin  https://github.com/drvgautam/datumint-consultancy.git (fetch)
origin  https://github.com/drvgautam/datumint-consultancy.git (push)
```

## Next Steps

Once cloned:
1. Make changes to the consultancy site
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push origin main`
4. Cloudflare Pages will automatically rebuild from the private repository

