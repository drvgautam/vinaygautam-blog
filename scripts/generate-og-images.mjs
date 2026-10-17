import sharp from "sharp"
import { writeFile, mkdir, readdir, readFile, copyFile, stat } from "fs/promises"
import { join, dirname, relative } from "path"
import { fileURLToPath } from "url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** Recursively find index.md / index.mdx under blog content */
async function findPosts(dir, base = dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  let hasIndex = false
  for (const entry of entries) {
    if (entry.isFile() && (entry.name === "index.md" || entry.name === "index.mdx")) {
      hasIndex = true
      results.push({
        postDir: dir,
        indexPath: join(dir, entry.name),
        slug: relative(base, dir).replace(/\\/g, "/"),
      })
    }
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await findPosts(join(dir, entry.name), base, results)
    }
  }
  return results
}

async function generateOGImages() {
  console.log("Generating OG images for blog posts...")

  const contentDir = join(__dirname, "..", "src", "content", "blog")
  const publicBlogDir = join(__dirname, "..", "public", "blog")
  await mkdir(publicBlogDir, { recursive: true })

  let posts = []
  try {
    posts = await findPosts(contentDir)
  } catch (error) {
    console.log("No blog content directory yet:", error.message)
    return
  }

  for (const { postDir, indexPath, slug } of posts) {
    if (!slug) continue

    try {
      const content = await readFile(indexPath, "utf-8")
      const { data } = matter(content)

      if (data.draft === true) {
        console.log(`Skipping ${slug} - draft`)
        continue
      }

      const publicPostDir = join(publicBlogDir, slug)
      await mkdir(publicPostDir, { recursive: true })

      if (data.ogImage) {
        const contentImagePath = join(postDir, data.ogImage)
        try {
          await stat(contentImagePath)
          await copyFile(contentImagePath, join(publicPostDir, data.ogImage))
          console.log(`Copied custom OG image for ${slug}`)
        } catch {
          console.warn(`Custom OG image not found for ${slug}: ${data.ogImage}`)
        }
      }

      if (data.bannerImage) {
        const bannerImagePath = join(postDir, data.bannerImage)
        try {
          await stat(bannerImagePath)
          await copyFile(bannerImagePath, join(publicPostDir, data.bannerImage))
          console.log(`Copied banner image for ${slug}`)
        } catch {
          console.warn(`Banner image not found for ${slug}: ${data.bannerImage}`)
        }
      }

      if (data.ogImage) continue

      const { title, summary } = data
      if (!title || !summary) {
        console.log(`Skipping ${slug} - missing title or summary`)
        continue
      }

      const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#bg)"/>
          <text x="600" y="280"
                font-family="system-ui, -apple-system, sans-serif"
                font-size="48"
                font-weight="bold"
                fill="#ffffff"
                text-anchor="middle"
                dominant-baseline="middle">
            ${escapeXml(title.length > 60 ? title.substring(0, 57) + "..." : title)}
          </text>
          <text x="600" y="380"
                font-family="system-ui, -apple-system, sans-serif"
                font-size="28"
                fill="#cccccc"
                text-anchor="middle"
                dominant-baseline="middle">
            ${escapeXml(summary.length > 80 ? summary.substring(0, 80) + "..." : summary)}
          </text>
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

      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
      const contentImagePath = join(postDir, "og-image.png")
      await writeFile(contentImagePath, pngBuffer)
      await copyFile(contentImagePath, join(publicPostDir, "og-image.png"))
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

generateOGImages().catch(console.error)
