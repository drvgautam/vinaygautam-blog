import type { CollectionEntry } from "astro:content"
import { createEffect, createMemo, createSignal, For, Show, onMount } from "solid-js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"

type Props = {
  tags: string[]
  data: CollectionEntry<"blog">[]
}

export default function Blog({ data, tags }: Props) {
  const PAGE_SIZE = 5;
  const [filter, setFilter] = createSignal(new Set<string>())
  const [posts, setPosts] = createSignal<CollectionEntry<"blog">[]>([])
  const [page, setPage] = createSignal(1)
  const [isFilterOpen, setIsFilterOpen] = createSignal(false)
  const [tagQuery, setTagQuery] = createSignal("")

  // Initialize filter from URL query params
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tagParam = urlParams.get("tag")
    if (tagParam) {
      setFilter(new Set([tagParam]))
    }
  })

  // Update URL when filter changes
  createEffect(() => {
    const url = new URL(window.location.href)
    if (filter().size > 0) {
      const tags = Array.from(filter())
      url.searchParams.set("tag", tags[0])
    } else {
      url.searchParams.delete("tag")
    }
    window.history.replaceState({}, "", url.toString())
  })

  createEffect(() => {
    setPosts(data.filter((entry) => 
      Array.from(filter()).every((value) => 
        entry.data.tags.some((tag:string) => 
          tag.toLowerCase() === String(value).toLowerCase()
        )
      )
    ))
    setPage(1) // Reset to first page when filter changes
  }, [filter])

  const totalPages = () => Math.ceil(posts().length / PAGE_SIZE)
  const paginatedPosts = () => posts().slice((page() - 1) * PAGE_SIZE, page() * PAGE_SIZE)
  const filteredTags = createMemo(() =>
    tags.filter((t) => t.toLowerCase().includes(tagQuery().toLowerCase()))
  )

  function toggleTag(tag: string) {
    setFilter((prev) => 
      new Set(prev.has(tag) 
        ? [...prev].filter((t) => t !== tag) 
        : [...prev, tag]
      )
    )
  }

  return (
    <div class="flex flex-col gap-6">
      <div class="sticky top-24 z-20">
        <div class="relative">
          <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-xl shadow border border-gray-100 dark:border-gray-800 px-3 py-2 flex items-center gap-3">
            <button
              class="text-sm px-3 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-black/5 hover:dark:bg-white/10"
              onClick={() => setIsFilterOpen(!isFilterOpen())}
            >
              Filter
            </button>
            <div class="flex flex-wrap items-center gap-2">
              <Show when={filter().size === 0}>
                <span class="text-xs text-gray-500">No filters applied</span>
              </Show>
              <For each={[...filter()]}>{(t) => (
                <span class="px-2 py-0.5 text-xs rounded-full border border-gray-200 dark:border-gray-800">
                  {t}
                </span>
              )}</For>
            </div>
            <div class="ml-auto flex items-center gap-2">
              <Show when={filter().size > 0}>
                <button
                  class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-black/5 hover:dark:bg-white/10"
                  onClick={() => setFilter(new Set())}
                >
                  Clear
                </button>
              </Show>
            </div>
          </div>

          <Show when={isFilterOpen()}>
            <div class="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
            <div class="absolute left-0 right-0 mt-2 z-20">
              <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-3">
                <div class="flex items-center gap-2 mb-3">
                  <input
                    value={tagQuery()}
                    onInput={(e) => setTagQuery((e.currentTarget as HTMLInputElement).value)}
                    placeholder="Search tags"
                    class="w-full text-sm px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-transparent outline-none"
                  />
                </div>
                <ul class="max-h-60 overflow-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  <For each={filteredTags()}>
                    {(tag) => (
                      <li>
                        <button
                          onClick={() => toggleTag(tag)}
                          class={cn(
                            "w-full justify-start px-3 py-2 text-sm rounded border transition-colors flex items-center gap-2",
                            "border-gray-200 dark:border-gray-800",
                            "bg-white dark:bg-gray-900",
                            "hover:bg-black/5 hover:dark:bg-white/10",
                            filter().has(tag) && "bg-black text-white dark:bg-white dark:text-black"
                          )}
                          aria-pressed={filter().has(tag)}
                        >
                          {tag}
                        </button>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <div>
        <div class="flex flex-col space-y-6">
          <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <div>
              {page() > 1 ? <button onClick={() => setPage(page() - 1)} class="underline mr-4">Previous</button> : <span class="text-gray-400 mr-4">Previous</span>}
              {page() < totalPages() ? <button onClick={() => setPage(page() + 1)} class="underline">Next</button> : <span class="text-gray-400">Next</span>}
            </div>
            <div>Page {page()} of {totalPages()}</div>
          </div>
          <div class="text-sm mb-4">Showing {paginatedPosts().length} of {posts().length} posts</div>
          <ul class="flex flex-col gap-6">
            <For each={paginatedPosts()}>{(post) => (
              <li>
                <ArrowCard entry={post} />
              </li>
            )}</For>
          </ul>
          <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            <div>
              {page() > 1 ? <button onClick={() => setPage(page() - 1)} class="underline mr-4">Previous</button> : <span class="text-gray-400 mr-4">Previous</span>}
              {page() < totalPages() ? <button onClick={() => setPage(page() + 1)} class="underline">Next</button> : <span class="text-gray-400">Next</span>}
            </div>
            <div>Page {page()} of {totalPages()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
