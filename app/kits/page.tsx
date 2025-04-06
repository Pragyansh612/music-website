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
  downloads: number
  status: string
  createdAt: string
  price: number
}

interface FilterOptions {
  types: string[]
  bpmRanges: string[]
  genres: string[]
}

export default function KitsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [allKits, setAllKits] = useState<Kit[]>([])
  const [filteredKits, setFilteredKits] = useState<Kit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Add filter states
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    bpmRanges: [],
    genres: []
  })

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
          setAllKits([])
          setFilteredKits([])
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

        setAllKits(formattedKits)
        setFilteredKits(formattedKits)
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
  }, [supabase, router])

  // Apply filters whenever filter options, search query, or selected tab changes
  useEffect(() => {
    applyFilters()
  }, [filterOptions, searchQuery, selectedTab, allKits])

  const applyFilters = () => {
    let filtered = [...allKits]

    // Apply tab filter
    if (selectedTab !== "all") {
      // Convert tab value to appropriate category name from database
      const categoryMap: { [key: string]: string } = {
        drums: "Drum Kit",
        melodies: "Melody Loops",
        "sample-pack": "Sample Pack",
        oneshots: "Vocal Samples",
        fx: "Sound Effects"
      }
      
      filtered = filtered.filter(kit => 
        kit.type === categoryMap[selectedTab]
      )
    }

    // Apply type filters
    if (filterOptions.types.length > 0) {
      filtered = filtered.filter(kit => 
        filterOptions.types.includes(kit.type)
      )
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(kit => 
        kit.title.toLowerCase().includes(query) || 
        kit.description.toLowerCase().includes(query)
      )
    }

    setFilteredKits(filtered)
  }

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
  }

  const handleTypeFilterChange = (type: string) => {
    setFilterOptions(prev => {
      // If already selected, remove it; otherwise, add it
      const newTypes = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
        
      return { ...prev, types: newTypes }
    })
  }

  const handleBpmFilterChange = (bpmRange: string) => {
    setFilterOptions(prev => {
      const newBpmRanges = prev.bpmRanges.includes(bpmRange)
        ? prev.bpmRanges.filter(b => b !== bpmRange)
        : [...prev.bpmRanges, bpmRange]
        
      return { ...prev, bpmRanges: newBpmRanges }
    })
  }

  const handleGenreFilterChange = (genre: string) => {
    setFilterOptions(prev => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
        
      return { ...prev, genres: newGenres }
    })
  }

  const resetFilters = () => {
    setFilterOptions({
      types: [],
      bpmRanges: [],
      genres: []
    })
    setSearchQuery("")
  }

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
                        <input 
                          type="checkbox" 
                          className="rounded text-primary" 
                          checked={filterOptions.types.includes("Drum Kit")}
                          onChange={() => handleTypeFilterChange("Drum Kit")}
                        />
                        Drum Kits
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary" 
                          checked={filterOptions.types.includes("Melody Loops")}
                          onChange={() => handleTypeFilterChange("Melody Loops")}
                        />
                        Melody Loops
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.types.includes("Sample Pack")}
                          onChange={() => handleTypeFilterChange("Sample Pack")}
                        />
                        Sample Pack
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.types.includes("Vocal Samples")}
                          onChange={() => handleTypeFilterChange("Vocal Samples")}
                        />
                        Vocal Samples
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.types.includes("Sound Effects")}
                          onChange={() => handleTypeFilterChange("Sound Effects")}
                        />
                        Sound Effects
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">BPM Range</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.bpmRanges.includes("70-90")}
                          onChange={() => handleBpmFilterChange("70-90")}
                        />
                        70-90 BPM
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.bpmRanges.includes("90-110")}
                          onChange={() => handleBpmFilterChange("90-110")}
                        />
                        90-110 BPM
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.bpmRanges.includes("110+")}
                          onChange={() => handleBpmFilterChange("110+")}
                        />
                        110+ BPM
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Genre</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.genres.includes("Hip-Hop")}
                          onChange={() => handleGenreFilterChange("Hip-Hop")}
                        />
                        Hip-Hop
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.genres.includes("Electronic")}
                          onChange={() => handleGenreFilterChange("Electronic")}
                        />
                        Electronic
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded text-primary"
                          checked={filterOptions.genres.includes("Lo-Fi")}
                          onChange={() => handleGenreFilterChange("Lo-Fi")}
                        />
                        Lo-Fi
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mr-2 glass"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button 
                    size="sm" 
                    variant="premium" 
                    className="glass"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>

            <Tabs 
              defaultValue="all" 
              className="mb-8"
              value={selectedTab}
              onValueChange={handleTabChange}
            >
              <TabsList className="glass">
                <TabsTrigger value="all">All Kits</TabsTrigger>
                <TabsTrigger value="drums">Drum Kits</TabsTrigger>
                <TabsTrigger value="melodies">Melody Loops</TabsTrigger>
                <TabsTrigger value="sample-pack">Sample Pack</TabsTrigger>
                <TabsTrigger value="oneshots">Vocal Samples</TabsTrigger>
                <TabsTrigger value="fx">FX</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                {filteredKits.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredKits.map((kit) => (
                      <OrderCard key={kit.id} kit={kit} variant="detailed" />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No kits found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}