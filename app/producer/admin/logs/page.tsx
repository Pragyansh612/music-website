"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  CheckCircle,
  Download,
  User,
  Settings,
  Music,
  FileText,
  LogIn,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function LogsActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [timeRange, setTimeRange] = useState("all-time")

  // Filter logs based on search query, type, level, and time range
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || log.type === selectedType
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel

    const logDate = new Date(log.timestamp)
    const now = new Date()

    let matchesTimeRange = true
    if (timeRange === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      matchesTimeRange = logDate >= today
    } else if (timeRange === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesTimeRange = logDate >= weekAgo
    } else if (timeRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesTimeRange = logDate >= monthAgo
    }

    return matchesSearch && matchesType && matchesLevel && matchesTimeRange
  })

  // Sort logs based on selected sort option
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    return 0
  })

  const getLogIcon = (type: string, level: string) => {
    if (type === "auth") {
      return level === "error" ? (
        <AlertTriangle size={16} className="text-destructive" />
      ) : (
        <LogIn size={16} className="text-primary" />
      )
    } else if (type === "download") {
      return <Download size={16} className="text-primary" />
    } else if (type === "user") {
      return <User size={16} className="text-primary" />
    } else if (type === "system") {
      return level === "error" ? (
        <AlertTriangle size={16} className="text-destructive" />
      ) : (
        <Settings size={16} className="text-primary" />
      )
    } else if (type === "content") {
      return <Music size={16} className="text-primary" />
    } else {
      return <Info size={16} className="text-primary" />
    }
  }

  const getLogLevelBadge = (level: string) => {
    if (level === "info") {
      return <Badge variant="secondary">Info</Badge>
    } else if (level === "warning") {
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/20">
          Warning
        </Badge>
      )
    } else if (level === "error") {
      return <Badge variant="destructive">Error</Badge>
    } else {
      return <Badge>Debug</Badge>
    }
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
            <h1 className="text-3xl font-bold tracking-tight neon-text">Logs & Activity</h1>
            <p className="text-muted-foreground">Monitor system logs, user activity, and debug errors.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw size={14} />
            <span>Refresh Logs</span>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
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
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedType("all")}>
                      All Types
                      {selectedType === "all" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedType("auth")}>
                      Authentication
                      {selectedType === "auth" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedType("download")}>
                      Downloads
                      {selectedType === "download" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedType("user")}>
                      User Activity
                      {selectedType === "user" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedType("system")}>
                      System
                      {selectedType === "system" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedType("content")}>
                      Content
                      {selectedType === "content" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedLevel("all")}>
                      All Levels
                      {selectedLevel === "all" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLevel("info")}>
                      Info
                      {selectedLevel === "info" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLevel("warning")}>
                      Warning
                      {selectedLevel === "warning" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLevel("error")}>
                      Error
                      {selectedLevel === "error" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
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

            <TabsContent value="all" className="mt-0">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>
                    Showing {sortedLogs.length} logs {timeRange !== "all-time" ? `from ${timeRange}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedLogs.length > 0 ? (
                      sortedLogs.map((log, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {getLogIcon(log.type, log.level)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="font-medium">{log.message}</div>
                              <div className="flex items-center gap-2">
                                {getLogLevelBadge(log.level)}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {log.details && <p className="text-sm text-muted-foreground mt-1">{log.details}</p>}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                              {log.user && (
                                <div className="flex items-center gap-1">
                                  <User size={12} />
                                  <span>{log.user}</span>
                                </div>
                              )}
                              {log.ip && <div>IP: {log.ip}</div>}
                              {log.browser && <div>Browser: {log.browser}</div>}
                              {log.path && <div>Path: {log.path}</div>}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
                        <h3 className="text-lg font-medium">No logs found</h3>
                        <p>Try adjusting your filters or search query</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Types
interface Log {
  timestamp: string
  type: string
  level: string
  message: string
  details?: string
  user?: string
  ip?: string
  browser?: string
  path?: string
}

// Sample data
const logs: Log[] = [
  {
    timestamp: "2023-12-12T15:30:00Z",
    type: "auth",
    level: "info",
    message: "Admin login successful",
    user: "admin",
    ip: "192.168.1.1",
    browser: "Chrome 119.0.0 / Windows",
    path: "/producer/admin-access",
  },
  {
    timestamp: "2023-12-12T14:45:00Z",
    type: "download",
    level: "info",
    message: "Kit downloaded",
    details: "User downloaded 'Midnight Drums' kit",
    user: "john_doe",
    ip: "192.168.1.2",
    path: "/kits/1",
  },
  {
    timestamp: "2023-12-12T13:20:00Z",
    type: "content",
    level: "info",
    message: "New kit uploaded",
    details: "Admin uploaded 'Future Bass Elements' kit",
    user: "admin",
    ip: "192.168.1.1",
    path: "/producer/admin/kits/new",
  },
  {
    timestamp: "2023-12-11T10:15:00Z",
    type: "user",
    level: "info",
    message: "New user registration",
    details: "User 'beatmaker99' registered",
    ip: "192.168.1.3",
    path: "/signup",
  },
  {
    timestamp: "2023-12-10T16:30:00Z",
    type: "system",
    level: "warning",
    message: "High server load detected",
    details: "CPU usage exceeded 80% for 5 minutes",
    path: "/system/monitoring",
  },
  {
    timestamp: "2023-12-10T09:45:00Z",
    type: "auth",
    level: "error",
    message: "Failed login attempt",
    details: "Multiple failed login attempts for user 'admin'",
    ip: "203.0.113.1",
    path: "/producer/admin-access",
  },
  {
    timestamp: "2023-12-09T14:20:00Z",
    type: "content",
    level: "info",
    message: "Kit updated",
    details: "Admin updated 'Lo-Fi Dreams' kit details",
    user: "admin",
    ip: "192.168.1.1",
    path: "/producer/admin/kits/2/edit",
  },
  {
    timestamp: "2023-12-08T11:10:00Z",
    type: "download",
    level: "info",
    message: "Kit downloaded",
    details: "User downloaded 'Neon Melodies' kit",
    user: "producer123",
    ip: "192.168.1.4",
    path: "/kits/3",
  },
  {
    timestamp: "2023-12-07T15:40:00Z",
    type: "system",
    level: "error",
    message: "Database connection error",
    details: "Failed to connect to database for 30 seconds",
    path: "/system/database",
  },
  {
    timestamp: "2023-12-06T13:25:00Z",
    type: "user",
    level: "warning",
    message: "User account locked",
    details: "Account 'jlee_beats' locked due to multiple failed login attempts",
    user: "jlee_beats",
    ip: "192.168.1.5",
    path: "/login",
  },
]

