type Env = {
  VIEWS?: KVNamespace
}

const KEY_PREFIX = "views:blog:"
const MAX_SLUGS = 50

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9/_-]{0,200}$/i.test(slug) && !slug.includes("..")
}

function kvKey(slug: string): string {
  return `${KEY_PREFIX}${slug}`
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const raw = url.searchParams.get("slugs") || ""
  const slugs = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))].slice(0, MAX_SLUGS)

  if (slugs.length === 0) {
    return json({ error: "Missing slugs query parameter" }, 400)
  }

  const invalid = slugs.find((s) => !isValidSlug(s))
  if (invalid) {
    return json({ error: `Invalid slug: ${invalid}` }, 400)
  }

  const views = context.env.VIEWS
  const result: Record<string, number> = {}

  if (!views) {
    for (const slug of slugs) result[slug] = 0
    return json(result)
  }

  await Promise.all(
    slugs.map(async (slug) => {
      const value = await views.get(kvKey(slug))
      result[slug] = value ? Number.parseInt(value, 10) || 0 : 0
    })
  )

  return json(result)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: { slug?: string }
  try {
    body = await context.request.json()
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : ""
  if (!slug || !isValidSlug(slug)) {
    return json({ error: "Invalid or missing slug" }, 400)
  }

  const views = context.env.VIEWS
  if (!views) {
    return json({ slug, views: 0 })
  }

  const key = kvKey(slug)
  const current = Number.parseInt((await views.get(key)) || "0", 10) || 0
  const next = current + 1
  await views.put(key, String(next))

  return json({ slug, views: next })
}
