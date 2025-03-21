import type { MetadataRoute } from "next"

// Sample data - in a real app, this would come from your database
const kits = [
  { id: "1", name: "Midnight Drums", updatedAt: new Date() },
  { id: "2", name: "Lo-Fi Dreams", updatedAt: new Date() },
  { id: "3", name: "Neon Melodies", updatedAt: new Date() },
  { id: "4", name: "Urban Essentials", updatedAt: new Date() },
  { id: "5", name: "Trap Universe", updatedAt: new Date() },
  { id: "6", name: "Future Bass Elements", updatedAt: new Date() },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://prodbyshyrap.com"

  // Main pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kits`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/licensing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ] as MetadataRoute.Sitemap

  // Kit pages
  const kitPages = kits.map((kit) => ({
    url: `${baseUrl}/kits/${kit.id}`,
    lastModified: kit.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  })) as MetadataRoute.Sitemap

  return [...staticPages, ...kitPages]
}

