import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date)
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "")
  const wordCount = textOnly.split(/\s+/).length
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed()
  return `${readingTimeMinutes} min read`
}

/** Series chapters (order > 0) stay reachable by URL but are hidden from blog listings. */
export function isListedBlogPost(post: {
  data: { draft?: boolean; series?: string; seriesOrder?: number }
}) {
  if (post.data.draft) return false
  if (post.data.series && (post.data.seriesOrder ?? 0) > 0) return false
  return true
}
