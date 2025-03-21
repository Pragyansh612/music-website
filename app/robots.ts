import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/producer/admin-access", "/producer/admin", "/api/", "/private/"],
    },
    sitemap: "https://prodbyshyrap.com/sitemap.xml",
  }
}

