"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Download,
  FileMusic,
  Music,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("week")

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
            <h1 className="text-3xl font-bold tracking-tight neon-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening with your site.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/producer/admin/kits/new">
                <Music size={16} />
                <span>Add New Kit</span>
              </Link>
            </Button>
            <Button asChild variant="premium" size="sm" className="gap-1">
              <Link href="/producer/admin/settings">
                <BarChart3 size={16} />
                <span>View Reports</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="week" onValueChange={setTimeRange} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="glass">
                <TabsTrigger value="day">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar size={16} />
                <span>Custom Range</span>
              </Button>
            </div>

            <TabsContent value="day" className="mt-6 space-y-6">
              <StatsCards timeRange="day" />
            </TabsContent>

            <TabsContent value="week" className="mt-6 space-y-6">
              <StatsCards timeRange="week" />
            </TabsContent>

            <TabsContent value="month" className="mt-6 space-y-6">
              <StatsCards timeRange="month" />
            </TabsContent>

            <TabsContent value="year" className="mt-6 space-y-6">
              <StatsCards timeRange="year" />
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Downloads</span>
                  <Badge variant="outline" className="font-normal">
                    Last 24 hours
                  </Badge>
                </CardTitle>
                <CardDescription>Latest kit downloads by users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentDownloads.map((download, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-10 w-10 relative rounded overflow-hidden shrink-0">
                      <Image
                        src={download.kitImage || "/placeholder.svg"}
                        alt={download.kitName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{download.kitName}</h3>
                        <span className="text-xs text-muted-foreground">{download.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{download.userName}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {download.kitType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/producer/admin/downloads">View All Downloads</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Popular Kits</span>
                  <Badge variant="outline" className="font-normal">
                    By Downloads
                  </Badge>
                </CardTitle>
                <CardDescription>Most downloaded kits this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularKits.map((kit, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-10 w-10 relative rounded overflow-hidden shrink-0">
                      <Image src={kit.image || "/placeholder.svg"} alt={kit.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{kit.name}</h3>
                        <span className="text-xs font-medium text-primary">{kit.downloads} downloads</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {kit.type}
                        </Badge>
                        <span>•</span>
                        <span>{kit.fileCount} files</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/producer/admin/kits">View All Kits</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions performed on the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="relative pl-6">
                    {index !== recentActivity.length - 1 && (
                      <div className="absolute top-6 bottom-0 left-3 w-px bg-border" />
                    )}
                    <div className="absolute top-1 left-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <Badge variant="outline" className="text-xs font-normal">
                          {activity.time}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      {activity.user && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users size={10} className="text-primary" />
                            </div>
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/producer/admin/logs">View All Activity</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

function StatsCards({ timeRange }: { timeRange: string }) {
  // In a real app, these would be fetched based on the time range
  const stats = {
    day: {
      downloads: 124,
      users: 15,
      kits: 0,
      revenue: 0,
    },
    week: {
      downloads: 842,
      users: 67,
      kits: 2,
      revenue: 0,
    },
    month: {
      downloads: 3254,
      users: 189,
      kits: 5,
      revenue: 0,
    },
    year: {
      downloads: 28750,
      users: 1245,
      kits: 24,
      revenue: 0,
    },
  }

  const currentStats = stats[timeRange as keyof typeof stats]

  const cards = [
    {
      title: "Total Downloads",
      value: currentStats.downloads,
      change: "+12.5%",
      icon: <Download size={20} className="text-primary" />,
      link: "/producer/admin/downloads",
    },
    {
      title: "New Users",
      value: currentStats.users,
      change: "+5.2%",
      icon: <Users size={20} className="text-primary" />,
      link: "/producer/admin/users",
    },
    {
      title: "New Kits",
      value: currentStats.kits,
      change: "+0%",
      icon: <FileMusic size={20} className="text-primary" />,
      link: "/producer/admin/kits",
    },
    {
      title: "Revenue",
      value: `$${currentStats.revenue}`,
      change: "+0%",
      icon: <TrendingUp size={20} className="text-primary" />,
      link: "/producer/admin/settings",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="glass-card hover-lift">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">{card.value}</h3>
                  <Badge variant={card.change.startsWith("+") ? "default" : "secondary"} className="text-xs">
                    {card.change}
                  </Badge>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">{card.icon}</div>
            </div>
            <Separator className="my-4" />
            <Button asChild variant="ghost" size="sm" className="w-full justify-between">
              <Link href={card.link}>
                <span>View Details</span>
                <ArrowUpRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Sample data
const recentDownloads = [
  {
    kitName: "Midnight Drums",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitType: "Drum Kit",
    userName: "john_doe",
    time: "10 minutes ago",
  },
  {
    kitName: "Neon Melodies",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitType: "Melody Loops",
    userName: "producer123",
    time: "45 minutes ago",
  },
  {
    kitName: "Lo-Fi Dreams",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitType: "Sample Pack",
    userName: "beatmaker",
    time: "2 hours ago",
  },
  {
    kitName: "Urban Essentials",
    kitImage: "/placeholder.svg?height=40&width=40",
    kitType: "Sample Pack",
    userName: "music_creator",
    time: "3 hours ago",
  },
]

const popularKits = [
  {
    name: "Midnight Drums",
    image: "/placeholder.svg?height=40&width=40",
    type: "Drum Kit",
    downloads: 1245,
    fileCount: 45,
  },
  {
    name: "Lo-Fi Dreams",
    image: "/placeholder.svg?height=40&width=40",
    type: "Sample Pack",
    downloads: 987,
    fileCount: 38,
  },
  {
    name: "Neon Melodies",
    image: "/placeholder.svg?height=40&width=40",
    type: "Melody Loops",
    downloads: 856,
    fileCount: 32,
  },
  {
    name: "Urban Essentials",
    image: "/placeholder.svg?height=40&width=40",
    type: "Sample Pack",
    downloads: 742,
    fileCount: 60,
  },
]

const recentActivity = [
  {
    title: "New Kit Uploaded",
    description: "A new kit 'Future Bass Elements' has been uploaded to the site.",
    time: "15 minutes ago",
    icon: <Music size={14} className="text-primary" />,
    user: "Admin",
  },
  {
    title: "User Registration",
    description: "New user 'beatmaker99' has registered on the site.",
    time: "1 hour ago",
    icon: <Users size={14} className="text-primary" />,
  },
  {
    title: "Download Milestone",
    description: "The kit 'Midnight Drums' has reached 1000 downloads!",
    time: "3 hours ago",
    icon: <Download size={14} className="text-primary" />,
  },
  {
    title: "Website Settings Updated",
    description: "Homepage banner and featured kits have been updated.",
    time: "5 hours ago",
    icon: <Settings size={14} className="text-primary" />,
    user: "Admin",
  },
]

