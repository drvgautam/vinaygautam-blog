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

export default function ViewCount(props: Props) {
  const [views, setViews] = createSignal<number | null>(null)

  onMount(async () => {
    const slug = props.slug
    if (!slug) return

    try {
      if (props.increment) {
        const key = sessionKey(slug)
        const already = sessionStorage.getItem(key)
        if (!already) {
          const res = await fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          })
          if (res.ok) {
            const data = (await res.json()) as { views?: number }
            if (typeof data.views === "number") {
              sessionStorage.setItem(key, "1")
              setViews(data.views)
              return
            }
          }
        }
      }

      const res = await fetch(`/api/views?slugs=${encodeURIComponent(slug)}`)
      if (!res.ok) return
      const data = (await res.json()) as Record<string, number>
      if (typeof data[slug] === "number") setViews(data[slug])
    } catch {
      // Hide count when API/KV is unavailable (local preview, missing binding).
    }
  })

  return (
    <Show when={views() !== null}>
      <span
        class={`inline-flex items-center gap-1.5 ${props.class ?? ""}`}
        title={`${views()} views`}
        aria-label={`${views()} views`}
      >
        <svg class="size-4 stroke-current" aria-hidden="true">
          <use href="/ui.svg#eye" />
        </svg>
        <span>{formatViews(views()!)}</span>
      </span>
    </Show>
  )
}
