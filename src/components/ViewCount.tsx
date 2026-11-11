import { createSignal, onMount, Show } from "solid-js"

type Props = {
  slug: string
  increment?: boolean
  class?: string
}

const sessionKey = (slug: string) => `viewed:blog:${slug}`

function formatViews(n: number): string {
  return n.toLocaleString("en-US")
}

/** Inline eye icon — external <use href="/ui.svg#eye"> often fails to paint inside Solid islands. */
function EyeIcon() {
  return (
    <svg
      class="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

async function fetchCount(slug: string): Promise<number | null> {
  const res = await fetch(`/api/views?slugs=${encodeURIComponent(slug)}`)
  if (!res.ok) return null
  const data = (await res.json()) as Record<string, number>
  return typeof data[slug] === "number" ? data[slug] : null
}

export default function ViewCount(props: Props) {
  const [views, setViews] = createSignal<number | null>(null)

  onMount(async () => {
    const slug = props.slug
    if (!slug) return

    try {
      // Always load the current count so a refresh still shows (and updates) the number.
      const current = await fetchCount(slug)
      if (current !== null) setViews(current)

      if (!props.increment) return

      const key = sessionKey(slug)
      if (sessionStorage.getItem(key)) return

      const res = await fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) return

      const data = (await res.json()) as { views?: number }
      if (typeof data.views === "number") {
        sessionStorage.setItem(key, "1")
        setViews(data.views)
      }
    } catch {
      // Hide count when API/KV is unavailable.
    }
  })

  return (
    <Show when={views() !== null}>
      <span
        class={`inline-flex items-center gap-1.5 ${props.class ?? ""}`}
        title={`${views()} views`}
        aria-label={`${views()} views`}
      >
        <EyeIcon />
        <span>{formatViews(views()!)}</span>
      </span>
    </Show>
  )
}
