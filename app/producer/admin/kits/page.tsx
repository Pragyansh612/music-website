"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  FileMusic,
  CheckCircle,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrderCard } from "@/app/producer/components/OrderCard"

interface Kit {
  id: string;
  name: string;
  description: string;
  category: string;
  fileCount: number;
  downloads: number;
  status: string;
  createdAt: string;
  image: string;
  price: number;
}

export default function ManageKitsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [deleteKitId, setDeleteKitId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [kits, setKits] = useState<Kit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch kits from Supabase
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
        name: kit.name,
        description: kit.description,
        category: kit.category,
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
  }, [supabase, router])

  // Update the handleDeleteClick function
  const handleDeleteClick = (kitId: string) => {
    setDeleteKitId(kitId)
    setIsDeleteDialogOpen(true)
  }

  // Update the handleDeleteConfirm function to actually delete from Supabase
  const handleDeleteConfirm = async () => {
    if (!deleteKitId) return;
    
    try {
      // Delete files from kit_files table first (foreign key constraint)
      const { error: deleteFilesError } = await supabase
        .from('kit_files')
        .delete()
        .eq('kit_id', deleteKitId);
        
      if (deleteFilesError) throw deleteFilesError;
      
      // Then delete the kit record
      const { error: deleteKitError } = await supabase
        .from('kits')
        .delete()
        .eq('id', deleteKitId);
        
      if (deleteKitError) throw deleteKitError;
      
      // Update local state to remove the deleted kit
      setKits(kits.filter(kit => kit.id !== deleteKitId));
      
      toast({
        title: "Success",
        description: "Kit has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting kit:", error);
      toast({
        title: "Error",
        description: "Failed to delete kit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteKitId(null);
    }
  };

  // Filter kits based on search query and category
  const filteredKits = kits.filter((kit) => {
    const matchesSearch =
      kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || kit.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort kits based on selected sort option
  const sortedKits = [...filteredKits].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortBy === "downloads-high") return b.downloads - a.downloads
    if (sortBy === "downloads-low") return a.downloads - b.downloads
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    return 0
  })

  // Add a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your kits...</p>
        </div>
      </div>
    )
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

  return (
    <div>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight neon-text">Manage Kits</h1>
            <p className="text-muted-foreground">Upload, edit, and manage your sound kits and sample packs.</p>
          </div>
          <Button asChild variant="premium" size="sm" className="gap-1">
            <Link href="/producer/admin/kits/new">
              <Plus size={16} />
              <span>Add New Kit</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search kits..."
                    className="pl-10 glass-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter size={16} />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                      All Categories
                      {selectedCategory === "all" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("drum-kit")}>
                      Drum Kits
                      {selectedCategory === "drum-kit" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("melody-loops")}>
                      Melody Loops
                      {selectedCategory === "melody-loops" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("sample-pack")}>
                      Sample Packs
                      {selectedCategory === "sample-pack" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0 gap-1">
                      <ArrowUpDown size={14} />
                      <span className="hidden sm:inline-block">Sort</span>
                      <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest First
                      {sortBy === "newest" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest First
                      {sortBy === "oldest" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("downloads-high")}>
                      Most Downloads
                      {sortBy === "downloads-high" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("downloads-low")}>
                      Least Downloads
                      {sortBy === "downloads-low" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                      Name (A-Z)
                      {sortBy === "name-asc" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                      Name (Z-A)
                      {sortBy === "name-desc" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <TabsList className="glass">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              {sortedKits.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedKits.map((kit) => (
                    <OrderCard
                      key={kit.id}
                      kit={kit}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileMusic size={64} className="text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No kits found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filters."
                      : "Upload your first sound kit to get started."}
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/producer/admin/kits/new">
                      <Plus size={16} className="mr-2" />
                      Create New Kit
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    {sortedKits.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead className="text-xs uppercase border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Category</th>
                            <th className="px-6 py-4 text-left">Files</th>
                            <th className="px-6 py-4 text-left">Downloads</th>
                            <th className="px-6 py-4 text-left">Created</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedKits.map((kit) => (
                            <tr key={kit.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 relative rounded overflow-hidden shrink-0">
                                    <Image
                                      src={kit.image || "/placeholder.svg?height=40&width=40"}
                                      alt={kit.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="font-medium">{kit.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="secondary">
                                  {kit.category === "drum-kit"
                                    ? "Drum Kit"
                                    : kit.category === "melody-loops"
                                      ? "Melody Loops"
                                      : "Sample Pack"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{kit.fileCount}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{kit.downloads}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(kit.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={kit.status === "active" ? "default" : "secondary"}>
                                  {kit.status === "active" ? "Active" : "Draft"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal size={16} />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                      <Link href={`/producer/admin/kits/${kit.id}`}>
                                        <FileMusic size={14} className="mr-2" />
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/producer/admin/kits/${kit.id}/edit`}>
                                        <Edit size={14} className="mr-2" />
                                        Edit Kit
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleDeleteClick(kit.id)}
                                    >
                                      <Trash2 size={14} className="mr-2" />
                                      Delete Kit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileMusic size={64} className="text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No kits found</h3>
                        <p className="text-muted-foreground mb-6">
                          {searchQuery || selectedCategory !== "all"
                            ? "Try adjusting your search or filters."
                            : "Upload your first sound kit to get started."}
                        </p>
                        <Button asChild variant="outline">
                          <Link href="/producer/admin/kits/new">
                            <Plus size={16} className="mr-2" />
                            Create New Kit
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this kit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 size={14} className="mr-2" />
              Delete Kit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}