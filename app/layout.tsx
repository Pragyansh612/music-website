import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProdByShyrap | Premium Beats & Sample Packs for Music Producers",
  description:
    "Discover premium beats, drum kits, and sample packs for music producers. High-quality sounds for hip-hop, trap, lo-fi, and more.",
  keywords: "beats, sample packs, drum kits, music production, hip-hop, trap, lo-fi, music producer, sound kits",
  openGraph: {
    title: "ProdByShyrap | Premium Beats & Sample Packs for Music Producers",
    description:
      "Discover premium beats, drum kits, and sample packs for music producers. High-quality sounds for hip-hop, trap, lo-fi, and more.",
    url: "https://prodbyshyrap.com",
    siteName: "ProdByShyrap",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ProdByShyrap - Premium Beats & Sample Packs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProdByShyrap | Premium Beats & Sample Packs for Music Producers",
    description:
      "Discover premium beats, drum kits, and sample packs for music producers. High-quality sounds for hip-hop, trap, lo-fi, and more.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://prodbyshyrap.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
          <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "ProdByShyrap",
              url: "https://prodbyshyrap.com",
              logo: "https://prodbyshyrap.com/logo.png",
              description: "Premium beats, drum kits, and sample packs for music producers.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://prodbyshyrap.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}