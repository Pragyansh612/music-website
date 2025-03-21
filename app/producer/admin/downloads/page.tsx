"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ChevronDown,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ManageDownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [timeRange, setTimeRange] = useState("all-time")

  // Filter downloads based on search query, category, and time range
  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch =
      download.kitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      download.userName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || download.kitCategory === selectedCategory

    const downloadDate = new Date(download.downloadedAt)
    const now = new Date()

    let matchesTimeRange = true
    if (timeRange === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      matchesTimeRange = downloadDate >= today
    } else if (timeRange === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesTimeRange = downloadDate >= weekAgo
    } else if (timeRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesTimeRange = downloadDate >= monthAgo
    }

    return matchesSearch && matchesCategory && matchesTimeRange
  })

  // Sort downloads based on selected sort option
  const sortedDownloads = [...filteredDownloads].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
    if (sortBy === "oldest") return new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime()
    if (sortBy === "kit-name-asc") return a.kitName.localeCompare(b.kitName)
    if (sortBy === "kit-name-desc") return b.kitName.localeCompare(a.kitName)
    if (sortBy === "user-name-asc") return a.userName.localeCompare(b.userName)
    if (sortBy === "user-name-desc") return b.userName.localeCompare(a.userName)
    return 0
  })

  // Calculate download statistics
  const totalDownloads = downloads.length
  const todayDownloads = downloads.filter((download) => {
    const downloadDate = new Date(download.downloadedAt)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return downloadDate >= today
  }).length

  const weekDownloads = downloads.filter((download) => {
    const downloadDate = new Date(download.downloadedAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return downloadDate >= weekAgo
  }).length

  const monthDownloads = downloads.filter((download) => {
    const downloadDate = new Date(download.downloadedAt)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return downloadDate >= monthAgo
  }).length

  // Group downloads by kit for the popular kits chart
  const kitDownloadCounts = downloads.reduce(
    (acc, download) => {
      const kitId = download.kitId
      if (!acc[kitId]) {
        acc[kitId] = {
          kitId,
          kitName: download.kitName,
          kitImage: download.kitImage,
          count: 0,
        }
      }
      acc[kitId].count++
      return acc
    },
    {} as Record<string, { kitId: string; kitName: string; kitImage: string; count: number }>,
  )

  const popularKits = Object.values(kitDownloadCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight neon-text">Manage Downloads</h1>
          <p className="text-muted-foreground">Track and analyze kit downloads across your platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                    <h3 className="text-3xl font-bold">{totalDownloads}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Download size={20} className="text-primary" />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground">All time</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Today</p>
                    <h3 className="text-3xl font-bold">{todayDownloads}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock size={20} className="text-primary" />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground">Last 24 hours</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <h3 className="text-3xl font-bold">{weekDownloads}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar size={20} className="text-primary" />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground">Last 7 days</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <h3 className="text-3xl font-bold">{monthDownloads}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 size={20} className="text-primary" />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground">Last 30 days</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Download History</CardTitle>
                <CardDescription>Recent downloads of your kits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search downloads..."
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
                        <DropdownMenuItem onClick={() => setSortBy("kit-name-asc")}>
                          Kit Name (A-Z)
                          {sortBy === "kit-name-asc" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("kit-name-desc")}>
                          Kit Name (Z-A)
                          {sortBy === "kit-name-desc" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("user-name-asc")}>
                          User Name (A-Z)
                          {sortBy === "user-name-asc" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("user-name-desc")}>
                          User Name (Z-A)
                          {sortBy === "user-name-desc" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Tabs defaultValue="all-time" onValueChange={setTimeRange} className="w-full sm:w-auto">
                    <TabsList className="glass w-full sm:w-auto">
                      <TabsTrigger value="all-time" className="flex-1 sm:flex-none">
                        All Time
                      </TabsTrigger>
                      <TabsTrigger value="today" className="flex-1 sm:flex-none">
                        Today
                      </TabsTrigger>
                      <TabsTrigger value="week" className="flex-1 sm:flex-none">
                        Week
                      </TabsTrigger>
                      <TabsTrigger value="month" className="flex-1 sm:flex-none">
                        Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left">Kit</th>
                        <th className="px-6 py-3 text-left">User</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDownloads.map((download, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 relative rounded overflow-hidden shrink-0">
                                <Image
                                  src={download.kitImage || "/placeholder.svg?height=40&width=40"}
                                  alt={download.kitName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{download.kitName}</div>
                                <Badge variant="secondary" className="text-xs">
                                  {download.kitCategory === "drum-kit"
                                    ? "Drum Kit"
                                    : download.kitCategory === "melody-loops"
                                      ? "Melody Loops"
                                      : "Sample Pack"}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={download.userAvatar} alt={download.userName} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {download.userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{download.userName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(download.downloadedAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{download.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Popular Kits</CardTitle>
                <CardDescription>Most downloaded kits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {popularKits.map((kit, index) => (
                    <div key={kit.kitId} className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground w-6 text-center">{index + 1}</div>
                      <div className="h-12 w-12 relative rounded overflow-hidden shrink-0">
                        <Image
                          src={kit.kitImage || "/placeholder.svg?height=48&width=48"}
                          alt={kit.kitName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{kit.kitName}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Download size={14} />
                          <span>{kit.count} downloads</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// Types
interface DownloadRecord {
  id: string
  kitId: string
  kitName: string
  kitImage: string
  kitCategory: string
  userId: string
  userName: string
  userAvatar: string
  downloadedAt: string
  ipAddress: string
}

// Sample data
const downloads: DownloadRecord[] = [
  {
    id: "1",
    kitId: "1",
    kitName: "Midnight Drums",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "drum-kit",
    userId: "1",
    userName: "john_doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-10T15:30:00Z",
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    kitId: "3",
    kitName: "Neon Melodies",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "melody-loops",
    userId: "2",
    userName: "producer123",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-11T10:15:00Z",
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    kitId: "2",
    kitName: "Lo-Fi Dreams",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "sample-pack",
    userId: "3",
    userName: "beatmaker",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-09T14:45:00Z",
    ipAddress: "192.168.1.3",
  },
  {
    id: "4",
    kitId: "4",
    kitName: "Urban Essentials",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "sample-pack",
    userId: "4",
    userName: "music_creator",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-08T09:20:00Z",
    ipAddress: "192.168.1.4",
  },
  {
    id: "5",
    kitId: "1",
    kitName: "Midnight Drums",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "drum-kit",
    userId: "2",
    userName: "producer123",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-07T16:10:00Z",
    ipAddress: "192.168.1.5",
  },
  {
    id: "6",
    kitId: "5",
    kitName: "Trap Universe",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "drum-kit",
    userId: "5",
    userName: "tb_producer",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-06T11:30:00Z",
    ipAddress: "192.168.1.6",
  },
  {
    id: "7",
    kitId: "2",
    kitName: "Lo-Fi Dreams",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "sample-pack",
    userId: "1",
    userName: "john_doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-05T13:45:00Z",
    ipAddress: "192.168.1.7",
  },
  {
    id: "8",
    kitId: "3",
    kitName: "Neon Melodies",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "melody-loops",
    userId: "4",
    userName: "music_creator",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-04T10:20:00Z",
    ipAddress: "192.168.1.8",
  },
  {
    id: "9",
    kitId: "1",
    kitName: "Midnight Drums",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "drum-kit",
    userId: "3",
    userName: "beatmaker",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-03T15:10:00Z",
    ipAddress: "192.168.1.9",
  },
  {
    id: "10",
    kitId: "6",
    kitName: "Future Bass Elements",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitCategory: "sample-pack",
    userId: "5",
    userName: "tb_producer",
    userAvatar: "/placeholder.svg?height=40&width=40",
    downloadedAt: "2023-12-02T09:30:00Z",
    ipAddress: "192.168.1.10",
  },
]

