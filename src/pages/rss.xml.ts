import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE } from "@consts"

type Context = {
  site: string
}

export async function GET(context: Context) {
	// Only get content from portfolio collections (not datumint)
	const posts = await getCollection("blog", ({ data }) => !data.draft)
  const projects = await getCollection("projects", ({ data }) => !data.draft)

  // Filter out any items that might be from datumint (extra safety check)
  const portfolioPosts = posts.filter(post => 
    !post.slug.includes('datumint') && 
    !post.slug.includes('DatumInt') &&
    !post.id.includes('datumint')
  )
  
  const portfolioProjects = projects.filter(project => 
    !project.slug.includes('datumint') && 
    !project.slug.includes('DatumInt') &&
    !project.id.includes('datumint')
  )

  const items = [...portfolioPosts, ...portfolioProjects]

  items.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())

  // Limit to most recent 20 items for better performance
  const recentItems = items.slice(0, 20)

  // Process items for RSS feed
  const renderedItems = recentItems.map((item) => {
    // Use summary if available, otherwise use a default description
    let description = item.data.summary || ""
    
    // If no summary, create a simple description from title
    if (!description) {
      description = `Read more about ${item.data.title}`
    }

    // Ensure description is properly formatted and not too long
    if (description.length > 500) {
      description = description.substring(0, 500) + '...'
    }

    // Format the link properly
    const link = `${context.site}${item.collection === "blog" ? `/blog/${item.slug}` : `/projects/${item.slug}`}`

    return {
      title: item.data.title,
      description: description,
      pubDate: item.data.date,
      link: link,
      author: SITE.AUTHOR,
      categories: item.data.tags || [],
    }
  })

  return rss({
    title: `${SITE.TITLE} - Blog & Projects`,
    description: SITE.DESCRIPTION,
    site: context.site,
    items: renderedItems,
    customData: `<language>en-us</language>
      <copyright>Copyright ${new Date().getFullYear()} ${SITE.AUTHOR}</copyright>
      <managingEditor>${SITE.AUTHOR}</managingEditor>
      <webMaster>${SITE.AUTHOR}</webMaster>
      <ttl>60</ttl>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <image>
        <url>${context.site}/og-vinay-profile.jpeg</url>
        <title>${SITE.TITLE}</title>
        <link>${context.site}</link>
        <width>1200</width>
        <height>630</height>
      </image>`,
    stylesheet: false,
  })
}
