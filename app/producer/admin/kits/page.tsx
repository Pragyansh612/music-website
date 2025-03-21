"use client"

import { useState } from "react"
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
}

export default function ManageKitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [deleteKitId, setDeleteKitId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const handleDeleteClick = (kitId: string) => {
    // setDeleteKitId(kitId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, this would call an API to delete the kit
    console.log(`Deleting kit with ID: ${deleteKitId}`)
    setIsDeleteDialogOpen(false)
    setDeleteKitId(null)
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedKits.map((kit) => (
                  <OrderCard 
                    key={kit.id}
                    kit={kit}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
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

// Sample data
const kits: Kit[] = [
  {
    id: "1",
    name: "Midnight Drums",
    description: "A collection of deep, atmospheric drum samples perfect for trap and hip-hop production.",
    category: "drum-kit",
    image: "/placeholder.svg?height=200&width=400",
    fileCount: 45,
    downloads: 1245,
    createdAt: "2023-10-15T12:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Lo-Fi Dreams",
    description: "Vintage-inspired samples and loops for creating chill lo-fi beats and ambient soundscapes.",
    category: "sample-pack",
    image: "/placeholder.svg?height=200&width=400",
    fileCount: 38,
    downloads: 987,
    createdAt: "2023-09-22T10:30:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Neon Melodies",
    description: "Bright, synthwave-inspired melody loops with retro vibes and modern production quality.",
    category: "melody-loops",
    image: "/placeholder.svg?height=200&width=400",
    fileCount: 32,
    downloads: 856,
    createdAt: "2023-11-05T15:45:00Z",
    status: "active",
  },
  {
    id: "4",
    name: "Urban Essentials",
    description: "Everything you need for modern urban music production, from drums to vocal chops.",
    category: "sample-pack",
    image: "/placeholder.svg?height=200&width=400",
    fileCount: 60,
    downloads: 742,
    createdAt: "2023-08-18T09:15:00Z",
    status: "active",
  },
  {
    id: "5",
    name: "Trap Universe",
    description: "Hard-hitting 808s, crisp hi-hats, and punchy snares for trap and drill production.",
    category: "drum-kit",
    image: "/placeholder.svg?height=200&width=400",
    fileCount: 52,
    downloads: 635,
    createdAt: "2023-12-01T14:20:00Z",
    status: "active",
  },
  {
    id: "6",
    name: "Future Bass Elements",
    description: "Cutting-edge sounds for future bass and electronic music production.",
    category: "sample-pack",
    image: "/placeholder.svg?height=200&width=400",
    fileCount: 48,
    downloads: 528,
    createdAt: "2023-10-28T11:10:00Z",
    status: "draft",
  },
]