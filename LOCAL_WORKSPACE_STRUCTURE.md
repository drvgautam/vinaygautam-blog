# Local Workspace Structure

## Directory Layout

Both your blog and consultancy sites are now in the same parent directory:

```
~/Documents/
  ├── portfolio-vinay/          # Blog site (public repo: vinaygautam-blog)
  │   ├── src/
  │   ├── public/
  │   ├── package.json
  │   └── ...
  │
  └── datumint-consultancy/    # Consultancy site (private repo)
      ├── src/
      ├── public/
      ├── package.json
      └── ...
```

## Repository Information

### Blog Site (`portfolio-vinay`)
- **Local Path**: `~/Documents/portfolio-vinay`
- **GitHub Repo**: `drvgautam/vinaygautam-blog` (public)
- **Domain**: `www.vinaygautam.com`
- **Cloudflare Pages**: `vinaygautam-blog`

### Consultancy Site (`datumint-consultancy`)
- **Local Path**: `~/Documents/datumint-consultancy`
- **GitHub Repo**: `drvgautam/datumint-consultancy` (private)
- **Domain**: `datumint.no`
- **Cloudflare Pages**: `datumint-consultancy`

## Quick Navigation

```bash
# Navigate to blog site
cd ~/Documents/portfolio-vinay

# Navigate to consultancy site
cd ~/Documents/datumint-consultancy

# Or use relative paths
cd ~/Documents
cd portfolio-vinay    # Blog
cd ../datumint-consultancy  # Consultancy
```

## Working with Both Sites

### Blog Site Commands
```bash
cd ~/Documents/portfolio-vinay
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
git status           # Check git status
git push origin main # Push to GitHub
```

### Consultancy Site Commands
```bash
cd ~/Documents/datumint-consultancy
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
git status           # Check git status
git push origin main # Push to GitHub (private repo)
```

## Development Workflow

### Working on Blog Site
1. `cd ~/Documents/portfolio-vinay`
2. Make changes
3. Test locally: `npm run dev`
4. Commit: `git add . && git commit -m "Your message"`
5. Push: `git push origin main`
6. Cloudflare Pages auto-deploys

### Working on Consultancy Site
1. `cd ~/Documents/datumint-consultancy`
2. Make changes
3. Test locally: `npm run dev`
4. Commit: `git add . && git commit -m "Your message"`
5. Push: `git push origin main`
6. Cloudflare Pages auto-deploys

## Benefits of This Structure

✅ **Organized**: Both sites in the same parent directory  
✅ **Separate**: Each site is its own repository  
✅ **Independent**: Can work on one without affecting the other  
✅ **Easy Navigation**: Quick access to both from `~/Documents/`

## Notes

- Both repositories are independent Git repositories
- Changes in one don't affect the other
- Each has its own `package.json`, `node_modules`, and build process
- Each deploys independently to Cloudflare Pages
- The blog site is public, consultancy site is private

