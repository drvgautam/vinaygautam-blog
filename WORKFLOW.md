# Development Workflow

## Branch Strategy

- **`main`**: Production branch - always stable, deployed to `www.vinaygautam.com`
- **`develop`**: Development branch - for testing changes before merging to main

## Daily Workflow

### 1. Start Working on a Feature

```bash
# Make sure you're on develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create a feature branch (optional, for larger features)
git checkout -b feature/your-feature-name
```

### 2. Make Changes

```bash
# Make your changes to files
# Test locally
npm run dev

# Build to check for errors
npm run build
```

### 3. Test Locally

```bash
# Start dev server
npm run dev

# Visit http://localhost:4321
# Test all functionality
```

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add feature: description of changes"

# Push to develop branch
git push origin develop
```

### 5. Test on Develop Branch

After pushing to `develop`:
- Cloudflare Pages will auto-deploy from `develop` branch (if configured)
- Or manually test the build locally
- Verify everything works as expected

### 6. Merge to Main (When Ready)

```bash
# Switch to main branch
git checkout main

# Pull latest main
git pull origin main

# Merge develop into main
git merge develop

# Push to main (triggers production deployment)
git push origin main
```

## Quick Commands

### Switch Branches
```bash
git checkout develop    # Switch to develop
git checkout main       # Switch to main
```

### Sync Branches
```bash
# Update develop from main (if main has hotfixes)
git checkout develop
git merge main
git push origin develop

# Update main from develop (normal workflow)
git checkout main
git merge develop
git push origin main
```

### Check Status
```bash
git status              # See current changes
git branch              # List all branches
git log --oneline -10   # Recent commits
```

## Best Practices

1. ✅ **Always test locally** before pushing
2. ✅ **Use descriptive commit messages**
3. ✅ **Keep `main` stable** - only merge tested code
4. ✅ **Work on `develop`** for regular development
5. ✅ **Test on `develop`** before merging to `main`

## Deployment

- **`main` branch** → Auto-deploys to `www.vinaygautam.com`
- **`develop` branch** → Can be configured for preview deployments

## Emergency Hotfixes

If you need to fix something urgently on main:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/quick-fix

# Make fix
# Test locally
git add .
git commit -m "Hotfix: description"
git push origin hotfix/quick-fix

# Merge to main
git checkout main
git merge hotfix/quick-fix
git push origin main

# Also merge back to develop
git checkout develop
git merge main
git push origin develop
```

