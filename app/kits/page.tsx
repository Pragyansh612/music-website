"use client"

import Link from "next/link"
import Image from "next/image"
import { Download, Filter, Headphones, Music, Package, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteFooter } from "@/components/site-footer"
import { OrderCard } from "@/components/order-card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
// import LoadingComponent from '@/components/Loading';

interface Kit {
  id: string
  title: string
  description: string
  image: string
  fileCount: number
  type: string
  bpm?: string
}

export default function KitsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [deleteKitId, setDeleteKitId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [allKits, setKits] = useState<Kit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const fetchKits = async () => {
      setIsLoading(true)
      try {
        // Get all kits without filtering by user
        const { data, error } = await supabase
          .from('kits')
          .select(`
          id,
          name,
          description,
          category,
          price,
          status,
          image,
          created_at
        `)
          .order('created_at', { ascending: false })

        console.log("Kits query result:", data, error)

        if (error) throw error

        if (!data || data.length === 0) {
          console.log("No kits found in database")
          setKits([])
          setIsLoading(false)
          return
        }

        // Format the kit data to match the expected structure
        const formattedKits: Kit[] = await Promise.all(data.map(async (kit) => {
          // Get download count
          const { count: downloadCount, error: downloadError } = await supabase
            .from('kit_downloads')
            .select('*', { count: 'exact', head: true })
            .eq('kit_id', kit.id)

          if (downloadError) console.error("Error fetching downloads:", downloadError)

          // Get file count from kit_files table
          const { count: fileCount, error: fileCountError } = await supabase
            .from('kit_files')
            .select('*', { count: 'exact', head: true })
            .eq('kit_id', kit.id)

          if (fileCountError) console.error("Error fetching file count:", fileCountError)

          // Get the image URL if there is an image path
          let imageUrl = '/placeholder.svg?height=40&width=40'
          if (kit.image) {
            const { data: imageData } = await supabase.storage
              .from('kit-images')
              .getPublicUrl(kit.image)

            imageUrl = imageData?.publicUrl || imageUrl
          }

          return {
            id: kit.id,
            title: kit.name,
            description: kit.description,
            type: kit.category,
            fileCount: fileCount || 0,
            downloads: downloadCount || 0,
            status: kit.status,
            createdAt: kit.created_at,
            image: imageUrl,
            price: kit.price || 0
          }
        }))

        setKits(formattedKits)
      } catch (error) {
        console.error("Error fetching kits:", error)
        toast({
          title: "Error",
          description: "Failed to load your kits. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchKits()
    setIsLoading(false);
  }, [supabase, router])

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

  // if (isLoading) return <LoadingComponent />;

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