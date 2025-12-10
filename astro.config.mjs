import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// https://astro.build/config
export default defineConfig({
  site: "https://www.vinaygautam.com",
  integrations: [
    mdx(), 
    sitemap(), 
    solidJs(), 
    tailwind({ applyBaseStyles: false }),
    {
      name: "generate-og-images",
      hooks: {
        "astro:build:start": async () => {
          try {
            await execAsync("node scripts/generate-og-images.mjs")
          } catch (error) {
            console.error("Error generating OG images:", error)
          }
        },
      },
    },
  ],
})
