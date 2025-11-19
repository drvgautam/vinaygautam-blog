# Vinay Gautam - Personal Portfolio & Blog

## Workflow

- `develop`: day-to-day development branch. Always work and test here first.
- `main`: production branch. Cloudflare deploys from this branch only.

Typical flow:

```bash
# 1. Start from develop
git checkout develop
git pull origin develop
npm run dev

# 2. Commit and push your tested changes
git add .
git commit -m "Describe change"
git push origin develop

# 3. When ready to deploy, fast-forward main
git checkout main
git pull origin main --ff-only
git merge --ff-only develop
npm run build
git push origin main
```

Need to roll back? Reset `main` to a prior commit (`git reset --hard <sha> && git push -f origin main`), then redeploy.
A modern, minimalist portfolio and blog site built with [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) as the base theme, heavily customized for personal use.

**Live Site**: [www.vinaygautam.com](https://www.vinaygautam.com)

## 🎨 About This Project

This is a customized version of the Astro Sphere theme, adapted to serve as a personal portfolio and technical blog. The site showcases blog posts, projects, and work experience, with a focus on Linux, DevOps, semantic data engineering, and context-aware GenAI.

## ✨ Customizations Made

### 🎯 Design & Layout

- **Custom Branding**: Personalized logo with terminal-style prompt (`>`) and name styling
- **Responsive Mobile Navigation**: Added `MobileNav` component for seamless mobile experience
- **Enhanced Homepage**: Custom hero section with animated particles and stars
- **Card-Based Layout**: Improved card designs for blog posts and projects with hover effects
- **Typography**: Custom font stack using Inter and Atkinson fonts

### 📱 Mobile Responsiveness

- **Mobile-First Design**: Complete responsive overhaul for all screen sizes
- **Mobile Navigation**: Hamburger menu with slide-out drawer for mobile devices
- **Responsive Typography**: Fluid text sizing that adapts to screen size
- **Touch-Friendly**: Optimized spacing and touch targets for mobile interaction

### 🔍 Enhanced Features

- **Client-Side Search**: Real-time search functionality for blog posts and projects
- **Search Index API**: Dynamic JSON index generation for fast search
- **Enhanced RSS Feed**: Improved RSS feed with better metadata, HTML stripping, and content filtering
- **SEO Optimizations**: 
  - Comprehensive meta tags (Open Graph, Twitter Cards)
  - JSON-LD structured data (Person, Article schemas)
  - Enhanced sitemap generation
  - Canonical URLs

### 🎨 UI/UX Improvements

- **Animated Backgrounds**: 
  - Light mode: Floating particles
  - Dark mode: Twinkling stars and meteor shower animations
- **Smooth Transitions**: Enhanced hover effects and transitions throughout
- **Improved Cards**: Better visual hierarchy with shadows, borders, and hover states
- **Tag System**: Visual tags for blog posts and projects

### 🔗 Navigation & Links

- **External Links**: Added link to DatumInt consultancy site (`datumint.no`)
- **Social Media Integration**: Customized social links (LinkedIn, GitHub, Medium, X/Twitter, Substack)
- **Buy Me a Coffee**: Integrated support link

### 📝 Content Management

- **Content Collections**: Organized blog posts and projects using Astro Content Collections
- **Draft Support**: Draft filtering for unpublished content
- **Tag System**: Tag-based categorization and filtering
- **Summary Fields**: Enhanced post summaries for better previews

### 🛠️ Technical Improvements

- **TypeScript**: Full TypeScript support with strict type checking
- **Component Architecture**: Modular, reusable component structure
- **Performance**: Optimized builds with code splitting
- **Accessibility**: Improved ARIA labels and semantic HTML

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build) v5.5.5
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v3.4.1
- **UI Components**: SolidJS for interactive components
- **Content**: Markdown & MDX support
- **Deployment**: Cloudflare Pages
- **Fonts**: Inter (Google Fonts) + Atkinson (self-hosted)

## 📋 Features

- ✅ 100/100 Lighthouse performance
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Accessible (WCAG compliant)
- ✅ SEO-friendly with structured data
- ✅ Type-safe with TypeScript
- ✅ Light/Dark theme support
- ✅ Animated UI elements
- ✅ Client-side search
- ✅ Auto-generated sitemap
- ✅ Auto-generated RSS feed
- ✅ Markdown & MDX support
- ✅ Code blocks with copy-to-clipboard
- ✅ Mobile navigation
- ✅ Tag-based filtering

## 💻 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/drvgautam/vinaygautam-blog.git
cd vinaygautam-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build for Production

```bash
# Build the site
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
portfolio-vinay/
├── public/           # Static assets (fonts, images, JS)
├── src/
│   ├── components/  # Astro & SolidJS components
│   ├── content/      # Content collections (blog, projects)
│   ├── layouts/     # Page layouts
│   ├── pages/        # Route pages
│   ├── styles/       # Global CSS
│   └── consts.ts     # Site configuration
├── astro.config.mjs # Astro configuration
└── package.json      # Dependencies
```

## ⚙️ Configuration

### Site Information

Edit `src/consts.ts` to customize:
- Site title and description
- Author information
- Navigation links
- Social media links

### Content

- **Blog Posts**: Add to `src/content/blog/`
- **Projects**: Add to `src/content/projects/`
- **Work Experience**: Add to `src/content/work/`

### Styling

- **Global Styles**: `src/styles/global.css`
- **Tailwind Config**: `tailwind.config.mjs`
- **Theme Colors**: Defined in CSS variables

## 🚢 Deployment

This site is deployed on **Cloudflare Pages**:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add custom domain: `www.vinaygautam.com`

For detailed deployment instructions, see the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).

## 📝 Development Workflow

This project uses a `develop` branch for testing before merging to `main`:

```bash
# Work on develop branch
git checkout develop

# Make changes, test locally
npm run dev

# Commit and push
git add .
git commit -m "Your changes"
git push origin develop

# When ready, merge to main
git checkout main
git merge develop
git push origin main  # Auto-deploys to production
```

See [WORKFLOW.md](./WORKFLOW.md) for detailed workflow instructions.

## 🎨 Customization Guide

### Adding a New Blog Post

1. Create a new directory in `src/content/blog/`
2. Add an `index.md` file with frontmatter:
   ```markdown
   ---
   title: "Your Post Title"
   date: 2024-01-01
   summary: "Post summary"
   tags: ["tag1", "tag2"]
   draft: false
   ---
   
   Your content here...
   ```

### Adding a New Project

1. Create a new directory in `src/content/projects/`
2. Add an `index.md` file similar to blog posts

### Customizing Colors

Edit CSS variables in `src/styles/global.css` or Tailwind classes throughout components.

## 📄 License

This project is based on [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) (MIT License) and has been heavily customized for personal use.

## 🙏 Acknowledgments

- **Base Theme**: [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) by [Mark Horn](https://github.com/markhorn-dev)
- **Inspiration**: Theme inspired by [Paco Coursey](https://paco.me/), [Lee Robinson](https://leerob.io/), and [Hayden Bleasel](https://www.haydenbleasel.com/)

## 📧 Contact

- **Website**: [www.vinaygautam.com](https://www.vinaygautam.com)
- **Email**: Available via contact page
- **LinkedIn**: [vinaygautam](https://www.linkedin.com/in/vinaygautam/)
- **GitHub**: [drvgautam](https://github.com/drvgautam)

---

Built with ❤️ using Astro, Tailwind CSS, and TypeScript.
