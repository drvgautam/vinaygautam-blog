# **Vinay Gautam — Portfolio & Technical Blog**

A clean, fast, and fully custom personal portfolio + technical blog built on top of the **Astro Sphere** theme.
The site showcases my writing, projects, research, and engineering work across **Linux, Homelab, DevOps, Semantic Data Engineering, and GenAI**.

🔗 **Live Site:** [https://www.vinaygautam.com](https://www.vinaygautam.com)
🔗 **Consulting:** [https://datumint.no](https://datumint.no)

---

## 🚀 Overview

This repository contains the source code for my personal blog & portfolio website.
It is built with **Astro**, **Tailwind CSS**, and **TypeScript**, and deployed via **Cloudflare Pages**.

I use this project to:

* publish technical blog posts
* share homelab + DevOps projects
* maintain a minimal public-facing portfolio
* link to my private consulting site

---

## ✨ Key Features (High-Level)

* **Modern Astro-based site**, fully customized
* **Fast & lightweight** (100/100 Lighthouse)
* **Mobile-first responsive UI**
* **Client-side search** for posts & projects
* **SEO-optimized** (OpenGraph, Twitter Cards, JSON-LD)
* **Dark/Light mode**, animated backgrounds
* **Content Collections** for structured blog & project content
* **Deployed globally via Cloudflare Pages**

---

## 🛠 Tech Stack

* **Framework:** Astro 5
* **UI:** Tailwind CSS
* **Interactive Components:** SolidJS
* **Content:** Markdown & MDX
* **Deployment:** Cloudflare Pages
* **Fonts:** Inter + Atkinson

---

## 🎨 Customization Summary

This project is **heavily modified** from the original Astro Sphere theme:

* Custom hero, logo, typography, and branding
* Improved card layouts, animations, and transitions
* Redesigned mobile navigation
* Enhanced blog & project templates
* Full SEO refactor (structured data, canonical URLs, sitemap)
* Client-side search using a custom JSON index
* External link integration (DatumInt consulting site)

> A detailed breakdown of all customizations is available in
> **docs/customization.md** and in my upcoming blog post.

---

## 📁 Project Structure

```
src/
  components/     # Astro/SolidJS components
  content/        # Blog, projects, work collections
  layouts/        # Page layouts
  pages/          # Routes
  styles/         # Global styles
  consts.ts       # Site metadata + nav links
public/           # Static assets
astro.config.mjs  # Astro configuration
```

---

## 💻 Getting Started

### Prerequisites

* Node.js 18+
* npm / pnpm / yarn / bun

### Installation

```bash
git clone https://github.com/drvgautam/vinaygautam-blog.git
cd vinaygautam-blog
npm install
npm run dev
```

Open **[http://localhost:4321](http://localhost:4321)**.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🚢 Deployment (Cloudflare Pages)

This is a static Astro site.
It can be deployed on any static hosting provider that supports HTML/CSS/JS output, including:

* Cloudflare Pages

* GitHub Pages

* Netlify

* Vercel

* Static S3 hosting

* Any CDN-capable file server


```bash
npm run build    # generates /dist
```
Deploy the contents of the dist/ directory to your hosting provider of choice.
---

## 📄 Documentation

Additional developer docs:

* **docs/customization.md** — Full theme modifications
* **docs/workflow.md** — Branching & deployment workflow
* **docs/content-guide.md** — How to add posts & projects

---

## 📜 License & Credits

* Based on **Astro Sphere** (MIT), by [Mark Horn](https://github.com/markhorn-dev)
* All custom work © 2025 Vinay Gautam

---

## 📬 Contact

* Website: [https://www.vinaygautam.com](https://www.vinaygautam.com)
* GitHub: [https://github.com/drvgautam](https://github.com/drvgautam)

---

