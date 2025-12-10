import sharp from "sharp"
import { writeFile, mkdir, readdir, readFile, copyFile, stat } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateOGImages() {
  console.log("Generating OG images for blog posts...")

  // Get all blog posts from content directory
  const contentDir = join(__dirname, "..", "src", "content", "blog")
  const blogDirs = await readdir(contentDir, { withFileTypes: true })

  // Images will be stored in content folders alongside index.md
  // Also copy them to public for serving
  const publicBlogDir = join(__dirname, "..", "public", "blog")
  await mkdir(publicBlogDir, { recursive: true })

  for (const dirent of blogDirs) {
    if (!dirent.isDirectory()) continue

    const slug = dirent.name
    const postDir = join(contentDir, slug)
    const indexPath = join(postDir, "index.md")

    try {
      // Read the markdown file
      const content = await readFile(indexPath, "utf-8")
      const { data } = matter(content)

      // Skip drafts
      if (data.draft === true) {
        console.log(`Skipping ${slug} - draft`)
        continue
      }

      // If post has custom ogImage, copy it from content to public
      if (data.ogImage) {
        const contentImagePath = join(postDir, data.ogImage)
        try {
          // Check if image exists in content folder
          await stat(contentImagePath)
          // Copy to public folder
          const publicPostDir = join(publicBlogDir, slug)
          await mkdir(publicPostDir, { recursive: true })
          const publicImagePath = join(publicPostDir, data.ogImage)
          await copyFile(contentImagePath, publicImagePath)
          console.log(`Copied custom OG image for ${slug}`)
        } catch (error) {
          console.warn(`Custom OG image not found for ${slug}: ${data.ogImage}`)
        }
        continue
      }

      const { title, summary } = data

      if (!title || !summary) {
        console.log(`Skipping ${slug} - missing title or summary`)
        continue
      }

      // Images are stored in the same directory as index.md

      // Create SVG with blog title
      const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <!-- Background gradient -->
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#bg)"/>
          
          <!-- Title text -->
          <text x="600" y="280" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="64" 
                font-weight="bold" 
                fill="#ffffff" 
                text-anchor="middle"
                dominant-baseline="middle">
            ${escapeXml(title)}
          </text>
          
          <!-- Summary text (truncated if too long) -->
          <text x="600" y="380" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="32" 
                fill="#cccccc" 
                text-anchor="middle"
                dominant-baseline="middle">
            ${escapeXml(summary.length > 80 ? summary.substring(0, 80) + "..." : summary)}
          </text>
          
          <!-- Author/URL at bottom -->
          <text x="600" y="580" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="24" 
                fill="#888888" 
                text-anchor="middle"
                dominant-baseline="middle">
            vinaygautam.com
          </text>
        </svg>
      `.trim()

      // Convert SVG to PNG using sharp
      const pngBuffer = await sharp(Buffer.from(svg))
        .png()
        .toBuffer()

      // Write to src/content/blog/{slug}/og-image.png (same folder as index.md)
      const contentImagePath = join(postDir, "og-image.png")
      await writeFile(contentImagePath, pngBuffer)

      // Also copy to public/blog/{slug}/ for serving
      const publicPostDir = join(publicBlogDir, slug)
      await mkdir(publicPostDir, { recursive: true })
      const publicImagePath = join(publicPostDir, "og-image.png")
      await copyFile(contentImagePath, publicImagePath)

      console.log(`Generated OG image for ${slug}`)
    } catch (error) {
      console.error(`Error processing ${slug}:`, error.message)
    }
  }

  console.log("OG image generation complete!")
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Run the script
generateOGImages().catch(console.error)

