"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Mail,
  Ban,
  CheckCircle,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ManageUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filter users based on search query and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.status === "active") ||
      (selectedStatus === "banned" && user.status === "banned")

    return matchesSearch && matchesStatus
  })

  // Sort users based on selected sort option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    if (sortBy === "oldest") return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
    if (sortBy === "downloads-high") return b.totalDownloads - a.totalDownloads
    if (sortBy === "downloads-low") return a.totalDownloads - b.totalDownloads
    if (sortBy === "name-asc") return a.name.localeCompare(b.name)
    if (sortBy === "name-desc") return b.name.localeCompare(a.name)
    return 0
  })

  const handleBanClick = (user: User) => {
    setSelectedUser(user)
    setIsBanDialogOpen(true)
  }

  const handleViewClick = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleBanConfirm = () => {
    // In a real app, this would call an API to ban/unban the user
    console.log(`${selectedUser?.status === "active" ? "Banning" : "Unbanning"} user: ${selectedUser?.id}`)
    setIsBanDialogOpen(false)
    setSelectedUser(null)
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight neon-text">Manage Users</h1>
          <p className="text-muted-foreground">View and manage user accounts, track activity, and moderate users.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
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
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                      All Users
                      {selectedStatus === "all" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                      Active Users
                      {selectedStatus === "active" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("banned")}>
                      Banned Users
                      {selectedStatus === "banned" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
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
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="banned">Banned</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left">User</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Joined</th>
                          <th className="px-6 py-4 text-left">Downloads</th>
                          <th className="px-6 py-4 text-left">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">@{user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(user.joinedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.totalDownloads}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                {user.status === "active" ? "Active" : "Banned"}
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
                                  <DropdownMenuItem onClick={() => handleViewClick(user)}>
                                    <Eye size={14} className="mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail size={14} className="mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className={
                                      user.status === "active"
                                        ? "text-destructive focus:text-destructive"
                                        : "text-primary focus:text-primary"
                                    }
                                    onClick={() => handleBanClick(user)}
                                  >
                                    {user.status === "active" ? (
                                      <>
                                        <Ban size={14} className="mr-2" />
                                        Ban User
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle size={14} className="mr-2" />
                                        Unban User
                                      </>
                                    )}
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

            <TabsContent value="active" className="mt-0">
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left">User</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Joined</th>
                          <th className="px-6 py-4 text-left">Downloads</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedUsers
                          .filter((user) => user.status === "active")
                          .map((user) => (
                            <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(user.joinedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.totalDownloads}</td>
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
                                    <DropdownMenuItem onClick={() => handleViewClick(user)}>
                                      <Eye size={14} className="mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail size={14} className="mr-2" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleBanClick(user)}
                                    >
                                      <Ban size={14} className="mr-2" />
                                      Ban User
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

            <TabsContent value="banned" className="mt-0">
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left">User</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Joined</th>
                          <th className="px-6 py-4 text-left">Ban Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedUsers
                          .filter((user) => user.status === "banned")
                          .map((user) => (
                            <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(user.joinedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.banDate ? new Date(user.banDate).toLocaleDateString() : "N/A"}
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
                                    <DropdownMenuItem onClick={() => handleViewClick(user)}>
                                      <Eye size={14} className="mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-primary focus:text-primary"
                                      onClick={() => handleBanClick(user)}
                                    >
                                      <CheckCircle size={14} className="mr-2" />
                                      Unban User
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

      {/* Ban/Unban Confirmation Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>{selectedUser?.status === "active" ? "Ban User" : "Unban User"}</DialogTitle>
            <DialogDescription>
              {selectedUser?.status === "active"
                ? "Are you sure you want to ban this user? They will no longer be able to access their account."
                : "Are you sure you want to unban this user? This will restore their account access."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-md">
            <Avatar>
              <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {selectedUser?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{selectedUser?.name}</div>
              <div className="text-sm text-muted-foreground">{selectedUser?.email}</div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={selectedUser?.status === "active" ? "destructive" : "default"} onClick={handleBanConfirm}>
              {selectedUser?.status === "active" ? (
                <>
                  <Ban size={14} className="mr-2" />
                  Ban User
                </>
              ) : (
                <>
                  <CheckCircle size={14} className="mr-2" />
                  Unban User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="glass-card max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the user account and activity.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Card className="glass-card">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-muted-foreground">@{selectedUser.username}</p>
                      <div className="mt-2">
                        <Badge variant={selectedUser.status === "active" ? "default" : "secondary"}>
                          {selectedUser.status === "active" ? "Active" : "Banned"}
                        </Badge>
                      </div>
                      <div className="mt-4 w-full">
                        <Button variant="outline" className="w-full gap-2">
                          <Mail size={14} />
                          <span>Send Email</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Joined</p>
                          <p className="font-medium">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Downloads</p>
                          <p className="font-medium">{selectedUser.totalDownloads}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Login</p>
                          <p className="font-medium">
                            {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedUser.recentActivity?.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              {activity.type === "download" ? (
                                <Download size={14} className="text-primary" />
                              ) : (
                                <Clock size={14} className="text-primary" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  variant={selectedUser.status === "active" ? "destructive" : "default"}
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleBanClick(selectedUser)
                  }}
                >
                  {selectedUser.status === "active" ? (
                    <>
                      <Ban size={14} className="mr-2" />
                      Ban User
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} className="mr-2" />
                      Unban User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Types
interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  status: "active" | "banned"
  joinedAt: string
  totalDownloads: number
  lastLogin?: string
  banDate?: string
  recentActivity?: {
    type: string
    description: string
    date: string
  }[]
}

// Sample data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    username: "john_doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinedAt: "2023-08-15T10:30:00Z",
    totalDownloads: 42,
    lastLogin: "2023-12-10T15:45:00Z",
    recentActivity: [
      {
        type: "download",
        description: "Downloaded 'Midnight Drums' kit",
        date: "2 days ago",
      },
      {
        type: "login",
        description: "Logged in from new device",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "producer123",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinedAt: "2023-09-22T14:15:00Z",
    totalDownloads: 78,
    lastLogin: "2023-12-12T09:20:00Z",
    recentActivity: [
      {
        type: "download",
        description: "Downloaded 'Neon Melodies' kit",
        date: "1 day ago",
      },
      {
        type: "download",
        description: "Downloaded 'Lo-Fi Dreams' kit",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "3",
    name: "Alex Johnson",
    username: "beatmaker",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "banned",
    joinedAt: "2023-07-10T08:45:00Z",
    totalDownloads: 23,
    lastLogin: "2023-11-05T16:30:00Z",
    banDate: "2023-11-10T12:00:00Z",
    recentActivity: [
      {
        type: "download",
        description: "Downloaded 'Lo-Fi Dreams' kit",
        date: "40 days ago",
      },
    ],
  },
  {
    id: "4",
    name: "Sam Wilson",
    username: "music_creator",
    email: "sam.wilson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinedAt: "2023-10-05T11:20:00Z",
    totalDownloads: 56,
    lastLogin: "2023-12-11T14:10:00Z",
    recentActivity: [
      {
        type: "download",
        description: "Downloaded 'Urban Essentials' kit",
        date: "3 days ago",
      },
      {
        type: "login",
        description: "Logged in from new location",
        date: "7 days ago",
      },
    ],
  },
  {
    id: "5",
    name: "Taylor Brown",
    username: "tb_producer",
    email: "taylor.brown@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    joinedAt: "2023-11-18T09:30:00Z",
    totalDownloads: 12,
    lastLogin: "2023-12-09T17:45:00Z",
    recentActivity: [
      {
        type: "download",
        description: "Downloaded 'Trap Universe' kit",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "6",
    name: "Jordan Lee",
    username: "jlee_beats",
    email: "jordan.lee@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "banned",
    joinedAt: "2023-06-30T13:45:00Z",
    totalDownloads: 89,
    lastLogin: "2023-10-15T10:20:00Z",
    banDate: "2023-10-20T16:30:00Z",
    recentActivity: [
      {
        type: "download",
        description: "Downloaded 'Future Bass Elements' kit",
        date: "65 days ago",
      },
    ],
  },
]

