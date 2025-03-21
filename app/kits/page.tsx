"use client"

import Link from "next/link"
import Image from "next/image"
import { Download, Filter, Headphones, Music, Package, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteFooter } from "@/components/site-footer"
import { OrderCard } from "@/components/order-card" // Import the OrderCard component

export default function KitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-10 relative overflow-hidden">
          <div className="absolute inset-0 noise"></div>
          <div className="container relative">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Music Kits</h1>
                <p className="text-muted-foreground">Browse and download our collection of free music kits</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search kits..."
                    className="pl-8 w-full md:w-[250px] glass-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={`glass ${isFilterOpen ? "bg-primary/10 border-primary/30" : ""}`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isFilterOpen ? 1 : 0,
                height: isFilterOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card p-4 mb-6">
                <h3 className="font-medium mb-3">Filter Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Type</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        Drum Kits
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        Melody Loops
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        One Shots
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">BPM Range</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        70-90 BPM
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        90-110 BPM
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        110+ BPM
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Genre</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        Hip-Hop
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        Electronic
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded text-primary" />
                        Lo-Fi
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button size="sm" variant="outline" className="mr-2 glass">
                    Reset
                  </Button>
                  <Button size="sm" variant="premium" className="glass">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
  
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="glass">
                <TabsTrigger value="all">All Kits</TabsTrigger>
                <TabsTrigger value="drums">Drum Kits</TabsTrigger>
                <TabsTrigger value="melodies">Melody Loops</TabsTrigger>
                <TabsTrigger value="oneshots">One Shots</TabsTrigger>
                <TabsTrigger value="fx">FX</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allKits.map((kit) => (
                    <OrderCard key={kit.id} kit={kit} variant="detailed" />
                  ))}
                </motion.div>
              </TabsContent>
              <TabsContent value="drums" className="mt-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allKits
                    .filter((kit) => kit.type === "Drum Kit")
                    .map((kit) => (
                      <OrderCard key={kit.id} kit={kit} variant="detailed" />
                    ))}
                </motion.div>
              </TabsContent>
              <TabsContent value="melodies" className="mt-6">
                {/* Melody Loops content would go here using OrderCard component */}
              </TabsContent>
              <TabsContent value="oneshots" className="mt-6">
                {/* One Shots content would go here using OrderCard component */}
              </TabsContent>
              <TabsContent value="fx" className="mt-6">
                {/* FX content would go here using OrderCard component */}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

// Sample data
const allKits = [
  {
    id: "midnight-drums",
    title: "Midnight Drums",
    description: "Dark and atmospheric drum kit with punchy kicks and crisp snares",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 45,
    type: "Drum Kit",
    bpm: "80-140",
  },
  {
    id: "neon-melodies",
    title: "Neon Melodies",
    description: "Vibrant melodic loops inspired by synthwave and retrowave",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 32,
    type: "Melody Loops",
    bpm: "100",
  },
  {
    id: "urban-essentials",
    title: "Urban Essentials",
    description: "Essential sounds for hip-hop and trap production",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 60,
    type: "Sample Pack",
    bpm: "Varied",
  },
  {
    id: "lofi-dreams",
    title: "Lo-Fi Dreams",
    description: "Mellow and nostalgic lo-fi samples and loops",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 38,
    type: "Sample Pack",
    bpm: "70-90",
  },
  {
    id: "future-bass-elements",
    title: "Future Bass Elements",
    description: "Modern future bass sounds with energetic synths and drums",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 52,
    type: "Sample Pack",
    bpm: "140-150",
  },
  {
    id: "analog-percussion",
    title: "Analog Percussion",
    description: "Warm analog drum sounds recorded from vintage hardware",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 40,
    type: "Drum Kit",
    bpm: "Any",
  },
  {
    id: "ambient-textures",
    title: "Ambient Textures",
    description: "Ethereal and atmospheric textures for ambient and cinematic music",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 25,
    type: "FX",
    bpm: "N/A",
  },
]