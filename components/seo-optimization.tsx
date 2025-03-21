"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

export function SEO({
  title = "ProdByShyrap | Premium Beats & Sample Packs for Music Producers",
  description = "Discover premium beats, drum kits, and sample packs for music producers. High-quality sounds for hip-hop, trap, lo-fi, and more.",
  keywords = "beats, sample packs, drum kits, music production, hip-hop, trap, lo-fi, music producer, sound kits",
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
}: SEOProps) {
  const router = useRouter()
  const canonicalUrl = `https://prodbyshyrap.com${router.asPath}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}

