"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, FileAudio, Music, Package, Play, Share2, Pause, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SEO } from "@/components/seo-optimization"

export default function KitDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the kit data based on the ID
  const kit = kits.find((k) => k.id === params.id) || kits[0]
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPreview, setCurrentPreview] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)

  // SEO data for this specific kit
  const seoData = {
    title: `${kit.title} - Free Music Kit | ProdByShyrap`,
    description: `Download ${kit.title} - ${kit.description}. High-quality ${kit.type} for music producers.`,
    keywords: `${kit.title}, ${kit.type}, free samples, music production, ${kit.bpm} BPM, music kit, download`,
    ogImage: kit.image,
    ogType: "product",
  }

  // Schema.org structured data for this kit
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: kit.title,
    image: kit.image,
    description: kit.description,
    brand: {
      "@type": "Brand",
      name: "ProdByShyrap",
    },
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const handlePlayAll = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentPreview(null)
    } else {
      setIsPlaying(true)
      // Start with the first preview
      const firstPreview = [...kit.samples.drums, ...kit.samples.melodies][0]
      setCurrentPreview(firstPreview.url)
    }
  }

  const handlePlaySingle = (url: string) => {
    if (currentPreview === url) {
      setIsPlaying(false)
      setCurrentPreview(null)
    } else {
      setIsPlaying(true)
      setCurrentPreview(url)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Add SEO component */}
      <SEO {...seoData} />

      {/* Add Schema.org structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <SiteHeader />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 noise"></div>
        <div className="container py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button asChild variant="ghost" size="sm" className="mb-4 glass">
              <Link href="/kits" className="gap-2">
                <ArrowLeft size={16} />
                Back to Kits
              </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="relative aspect-square overflow-hidden rounded-lg glass-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Image
                  src={kit.image || "/placeholder.svg"}
                  alt={`${kit.title} - ${kit.type} by ProdByShyrap`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-30"></div>

                {/* Play All Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    onClick={handlePlayAll}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause size={32} className="text-white" />
                    ) : (
                      <Play size={32} className="text-white ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Volume Controls */}
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm p-3 rounded-lg"
                  >
                    <button onClick={toggleMute} className="text-white">
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer"
                    />
                    <span className="text-white text-xs">{Math.round(volume * 100)}%</span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="glass">{kit.type}</Badge>
                    <Badge variant="outline" className="glass">
                      {kit.bpm} BPM
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold gradient-text">{kit.title}</h1>
                  <p className="text-muted-foreground mt-2">{kit.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col glass-card p-3 rounded-lg">
                    <span className="text-sm text-muted-foreground">Files</span>
                    <span className="font-medium">{kit.fileCount} samples</span>
                  </div>
                  <div className="flex flex-col glass-card p-3 rounded-lg">
                    <span className="text-sm text-muted-foreground">Format</span>
                    <span className="font-medium">WAV, 24-bit</span>
                  </div>
                  <div className="flex flex-col glass-card p-3 rounded-lg">
                    <span className="text-sm text-muted-foreground">Size</span>
                    <span className="font-medium">{kit.size} MB</span>
                  </div>
                  <div className="flex flex-col glass-card p-3 rounded-lg">
                    <span className="text-sm text-muted-foreground">Released</span>
                    <span className="font-medium">{kit.releaseDate}</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="w-full gap-2 glass relative overflow-hidden group h-12 text-lg" size="lg">
                      <span className="relative z-10">Download Kit</span>
                      <Download size={18} className="relative z-10" />
                      <span className="absolute inset-0 w-full h-full bg-primary/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    </Button>
                  </motion.div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2 glass">
                      <Share2 size={16} />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex-1 gap-2 glass ${isPlaying ? "bg-primary/20" : ""}`}
                      onClick={handlePlayAll}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      {isPlaying ? "Stop Preview" : "Preview All"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <Tabs defaultValue="samples" className="mt-10">
            <TabsList className="glass">
              <TabsTrigger value="samples">Samples</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="license">License</TabsTrigger>
            </TabsList>

            <TabsContent value="samples">
              <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-medium mb-4">Drums</h3>
                  <div className="space-y-3">
                    {kit.samples.drums.map((sample, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`${currentPreview === sample.url ? "bg-primary/20 glass-card" : ""}`}
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-primary/10 transition-colors">
                          <button
                            onClick={() => handlePlaySingle(sample.url)}
                            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"
                          >
                            {currentPreview === sample.url && isPlaying ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} className="ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className="font-medium">{sample.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <FileAudio size={12} />
                              <span>WAV • 24-bit • {sample.duration || "0:15"}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download size={14} />
                            <span className="hidden sm:inline">Preview</span>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-medium mb-4">Melodies</h3>
                  <div className="space-y-3">
                    {kit.samples.melodies.map((sample, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`${currentPreview === sample.url ? "bg-primary/20 glass-card" : ""}`}
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-primary/10 transition-colors">
                          <button
                            onClick={() => handlePlaySingle(sample.url)}
                            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"
                          >
                            {currentPreview === sample.url && isPlaying ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} className="ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className="font-medium">{sample.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Music size={12} />
                              <span>WAV • 24-bit • {sample.duration || "0:30"}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download size={14} />
                            <span className="hidden sm:inline">Preview</span>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="description">
              <motion.div
                className="prose prose-sm dark:prose-invert max-w-none glass-card p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>About this Kit</h3>
                <p>{kit.longDescription}</p>

                <h3>What's Included</h3>
                <ul>
                  <li>{kit.samples.drums.length} drum samples (kicks, snares, hi-hats, percussion)</li>
                  <li>{kit.samples.melodies.length} melodic loops</li>
                  <li>24-bit WAV format</li>
                  <li>Royalty-free for commercial and non-commercial use</li>
                </ul>

                <h3>How to Use</h3>
                <p>
                  Simply download the kit, extract the files, and import them into your favorite DAW. All samples are
                  labeled and organized for easy navigation.
                </p>
              </motion.div>
            </TabsContent>

            <TabsContent value="license">
              <motion.div
                className="prose prose-sm dark:prose-invert max-w-none glass-card p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>License Terms</h3>
                <p>
                  All samples in this kit are 100% royalty-free. You can use them in your commercial and non-commercial
                  productions without attribution.
                </p>

                <h4>You CAN:</h4>
                <ul>
                  <li>Use the samples in your music productions, both commercial and non-commercial</li>
                  <li>Modify, edit, and process the samples to fit your productions</li>
                  <li>Use the samples in music releases, films, games, and other media</li>
                </ul>

                <h4>You CANNOT:</h4>
                <ul>
                  <li>Resell or redistribute the samples as they are or as part of another sample pack</li>
                  <li>Claim ownership of the original samples</li>
                  <li>Share your download with others - please direct them to our website instead</li>
                </ul>

                <p>
                  For any questions regarding licensing, please visit our{" "}
                  <Link href="/licensing" className="text-primary hover:underline">
                    Licensing page
                  </Link>{" "}
                  or contact us at{" "}
                  <a href="mailto:info@prodbyshyrap.com" className="text-primary hover:underline">
                    info@prodbyshyrap.com
                  </a>
                  .
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>

          <Separator className="my-10 opacity-30" />

          <div>
            <motion.h2
              className="text-2xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              You Might Also Like
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {kits
                .filter((k) => k.id !== params.id)
                .slice(0, 4)
                .map((relatedKit) => (
                  <motion.div key={relatedKit.id} variants={itemVariants}>
                    <Card className="glass-card overflow-hidden group h-full flex flex-col">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={relatedKit.image || "/placeholder.svg"}
                          alt={`${relatedKit.title} - ${relatedKit.type} by ProdByShyrap`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="glass">
                            {relatedKit.type}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate group-hover:text-primary transition-colors duration-300">
                          {relatedKit.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Package size={12} />
                          <span>{relatedKit.fileCount} files</span>
                        </div>
                        <Button asChild size="sm" className="w-full mt-3 glass relative overflow-hidden group/btn">
                          <Link href={`/kits/${relatedKit.id}`}>
                            <span className="relative z-10">View Kit</span>
                            <span className="absolute inset-0 w-full h-full bg-primary/80 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></span>
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>
      </main>
      <SiteFooter />

      {/* Hidden audio element for preview playback */}
      {currentPreview && (
        <audio
          src={currentPreview}
          autoPlay={isPlaying}
          loop={false}
          muted={isMuted}
          volume={volume}
          onEnded={() => {
            setIsPlaying(false)
            setCurrentPreview(null)
          }}
          className="hidden"
        />
      )}
    </div>
  )
}

// Sample data with enhanced sample information
const kits = [
  {
    id: "midnight-drums",
    title: "Midnight Drums",
    description: "Dark and atmospheric drum kit with punchy kicks and crisp snares",
    longDescription:
      "Midnight Drums is a meticulously crafted collection of dark, atmospheric drum samples designed for producers working in trap, hip-hop, and electronic music genres. Each sound has been carefully processed to provide maximum impact while maintaining clarity and headroom in your mix.",
    image: "/placeholder.svg?height=600&width=600",
    fileCount: 45,
    type: "Drum Kit",
    bpm: "80-140",
    size: 250,
    releaseDate: "March 15, 2023",
    samples: {
      drums: [
        {
          name: "Midnight_Kick_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-bass-hit-2294.mp3",
          duration: "0:12",
        },
        {
          name: "Midnight_Kick_02",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3",
          duration: "0:08",
        },
        {
          name: "Midnight_Snare_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-sport-drums-558.mp3",
          duration: "0:10",
        },
        {
          name: "Midnight_Snare_02",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-and-percussion-545.mp3",
          duration: "0:15",
        },
        {
          name: "Midnight_HiHat_Closed_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3",
          duration: "0:06",
        },
        {
          name: "Midnight_HiHat_Open_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-sport-drums-558.mp3",
          duration: "0:09",
        },
      ],
      melodies: [
        {
          name: "Midnight_Atmosphere_Ebm_90BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:30",
        },
        {
          name: "Midnight_Pad_Cm_80BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-deep-urban-623.mp3",
          duration: "0:25",
        },
      ],
    },
  },
  {
    id: "neon-melodies",
    title: "Neon Melodies",
    description: "Vibrant melodic loops inspired by synthwave and retrowave",
    longDescription:
      "Neon Melodies brings the nostalgic sounds of the 80s into your modern productions with a collection of synthwave and retrowave inspired melodic loops. From lush pads to driving basslines and sparkling arpeggios, this pack has everything you need to create that perfect retro vibe.",
    image: "/placeholder.svg?height=600&width=600",
    fileCount: 32,
    type: "Melody Loops",
    bpm: "100",
    size: 180,
    releaseDate: "January 5, 2023",
    samples: {
      drums: [],
      melodies: [
        {
          name: "Neon_Arpeggio_Fm_100BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:28",
        },
        {
          name: "Neon_Bass_Am_100BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-deep-urban-623.mp3",
          duration: "0:22",
        },
        {
          name: "Neon_Pad_Gm_100BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-epical-drums-01-676.mp3",
          duration: "0:30",
        },
        {
          name: "Neon_Lead_Cm_100BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:26",
        },
        {
          name: "Neon_Chords_Dm_100BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-deep-urban-623.mp3",
          duration: "0:32",
        },
      ],
    },
  },
  {
    id: "urban-essentials",
    title: "Urban Essentials",
    description: "Essential sounds for hip-hop and trap production",
    longDescription:
      "Urban Essentials is your go-to sample pack for modern hip-hop and trap production. Featuring hard-hitting 808s, crisp snares, punchy kicks, and a variety of melodic elements, this pack provides all the essential sounds you need to create professional-quality urban tracks.",
    image: "/placeholder.svg?height=600&width=600",
    fileCount: 60,
    type: "Sample Pack",
    bpm: "Varied",
    size: 320,
    releaseDate: "April 20, 2023",
    samples: {
      drums: [
        {
          name: "Urban_808_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-bass-hit-2294.mp3",
          duration: "0:14",
        },
        {
          name: "Urban_808_02",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3",
          duration: "0:11",
        },
        {
          name: "Urban_Kick_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-sport-drums-558.mp3",
          duration: "0:08",
        },
        {
          name: "Urban_Snare_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-and-percussion-545.mp3",
          duration: "0:10",
        },
        {
          name: "Urban_HiHat_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3",
          duration: "0:06",
        },
      ],
      melodies: [
        {
          name: "Urban_Piano_Em_140BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:28",
        },
        {
          name: "Urban_Flute_Gm_130BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-deep-urban-623.mp3",
          duration: "0:24",
        },
        {
          name: "Urban_Strings_Bm_145BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-epical-drums-01-676.mp3",
          duration: "0:32",
        },
      ],
    },
  },
  {
    id: "lofi-dreams",
    title: "Lo-Fi Dreams",
    description: "Mellow and nostalgic lo-fi samples and loops",
    longDescription:
      "Lo-Fi Dreams captures the essence of chill, nostalgic lo-fi hip-hop with a collection of dusty drums, vinyl crackles, warm keys, and mellow melodies. Perfect for creating relaxing beats for studying, chilling, or  warm keys, and mellow melodies. Perfect for creating relaxing beats for studying, chilling, or background music.",
    image: "/placeholder.svg?height=600&width=600",
    fileCount: 38,
    type: "Sample Pack",
    bpm: "70-90",
    size: 210,
    releaseDate: "February 12, 2023",
    samples: {
      drums: [
        {
          name: "LoFi_Kick_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-bass-hit-2294.mp3",
          duration: "0:09",
        },
        {
          name: "LoFi_Snare_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3",
          duration: "0:07",
        },
        {
          name: "LoFi_HiHat_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-sport-drums-558.mp3",
          duration: "0:05",
        },
        {
          name: "LoFi_Vinyl_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-and-percussion-545.mp3",
          duration: "0:18",
        },
      ],
      melodies: [
        {
          name: "LoFi_Keys_Dm_75BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:30",
        },
        {
          name: "LoFi_Guitar_Am_80BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-deep-urban-623.mp3",
          duration: "0:26",
        },
        {
          name: "LoFi_Piano_Fm_85BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-epical-drums-01-676.mp3",
          duration: "0:28",
        },
      ],
    },
  },
  {
    id: "future-bass-elements",
    title: "Future Bass Elements",
    description: "Modern future bass sounds with energetic synths and drums",
    longDescription:
      "Future Bass Elements delivers everything you need to create cutting-edge future bass tracks. From powerful supersaws and wobble basses to crisp drums and innovative sound design elements, this pack is perfect for producers looking to create energetic, emotional electronic music.",
    image: "/placeholder.svg?height=600&width=600",
    fileCount: 52,
    type: "Sample Pack",
    bpm: "140-150",
    size: 280,
    releaseDate: "May 8, 2023",
    samples: {
      drums: [
        {
          name: "FutureBass_Kick_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-bass-hit-2294.mp3",
          duration: "0:10",
        },
        {
          name: "FutureBass_Snare_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3",
          duration: "0:08",
        },
        {
          name: "FutureBass_Clap_01",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-sport-drums-558.mp3",
          duration: "0:06",
        },
      ],
      melodies: [
        {
          name: "FutureBass_Chords_F_150BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:32",
        },
        {
          name: "FutureBass_Lead_A_145BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-deep-urban-623.mp3",
          duration: "0:28",
        },
        {
          name: "FutureBass_Bass_D_140BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-epical-drums-01-676.mp3",
          duration: "0:24",
        },
        {
          name: "FutureBass_Arp_G_150BPM",
          url: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3",
          duration: "0:30",
        },
      ],
    },
  },
]

