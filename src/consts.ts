import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Vinay Gautam",
  DESCRIPTION: "PhD in Computer Science | Software Developer | Data Engineer | Cloud Focussed | ML & AI Enthusiast. Personal notes, scripts, and projects on Linux, DevOps, semantic data engineering, and context-aware GenAI.",
  AUTHOR: "Vinay Gautam",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Optional support link; leave empty string to hide
export const BUY_ME_COFFEE_URL = "https://buymeacoffee.com/datumint"

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
  {
    TEXT: "DatumInt",
    HREF: "https://datumint.no",
  },
  { 
    TEXT: "Contact", 
    HREF: "/contact", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "https://www.linkedin.com/in/vinaygautam/",
    HREF: "https://www.linkedin.com/in/vinaygautam/",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "https://github.com/drvgautam",
    HREF: "https://github.com/drvgautam"
  },
  // {
  //   NAME: "Hashnode",
  //   ICON: "hashnode",
  //   TEXT: "https://hashnode.com/@drvgautam",
  //   HREF: "https://hashnode.com/@drvgautam"
  // },
  {
    NAME: "Medium",
    ICON: "medium",
    TEXT: "https://medium.com/@vkg.biet",
    HREF: "https://medium.com/@vkg.biet"
  },
  { 
    NAME: "X",
    ICON: "twitter-x",
    TEXT: "https://twitter.com/vinaygautam",
    HREF: "https://twitter.com/vinaygautam",
  },
  {
    NAME: "Substack",
    ICON: "substack",
    TEXT: "https://substack.com/@drvgautam",
    HREF: "https://substack.com/@drvgautam"
  },
]

