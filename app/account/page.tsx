"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, FileMusic, Package, Settings, Clock, LogOut, Heart, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 relative">
        {/* Background elements */}
        <div
          className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl floating-element"
          style={{ animation: "floating 8s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl floating-element"
          style={{ animation: "floating 10s ease-in-out infinite", animationDelay: "-2s" }}
        ></div>

        <div className="container py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="account-sidebar glass-card p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src="/placeholder.svg?height=56&width=56" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-lg">John Smith</h2>
                    <p className="text-sm text-muted-foreground">john.smith@example.com</p>
                  </div>
                </div>

                <Separator className="my-4 opacity-50" />

                <nav className="space-y-1 mb-6">
                  <button
                    className={`account-nav-item w-full text-left ${activeTab === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <Package size={18} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    className={`account-nav-item w-full text-left ${activeTab === "downloads" ? "active" : ""}`}
                    onClick={() => setActiveTab("downloads")}
                  >
                    <Download size={18} />
                    <span>My Downloads</span>
                  </button>
                  <button
                    className={`account-nav-item w-full text-left ${activeTab === "favorites" ? "active" : ""}`}
                    onClick={() => setActiveTab("favorites")}
                  >
                    <Heart size={18} />
                    <span>Favorites</span>
                  </button>
                  <button
                    className={`account-nav-item w-full text-left ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                  >
                    <Clock size={18} />
                    <span>Download History</span>
                  </button>
                  <button
                    className={`account-nav-item w-full text-left ${activeTab === "notifications" ? "active" : ""}`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                    <Badge className="ml-auto" variant="default">
                      3
                    </Badge>
                  </button>
                  <button
                    className={`account-nav-item w-full text-left ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings size={18} />
                    <span>Account Settings</span>
                  </button>
                </nav>

                <Separator className="my-4 opacity-50" />

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </Button>
              </div>

              {/* Main content */}
              <div className="flex-1">
                {activeTab === "dashboard" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <h1 className="text-3xl font-bold mb-6 neon-text">Dashboard</h1>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="stat-card">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Download size={20} className="text-primary" />
                            </div>
                            <Badge variant="outline">This Month</Badge>
                          </div>
                          <div className="stat-value">12</div>
                          <div className="stat-label">Total Downloads</div>
                        </div>

                        <div className="stat-card">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <FileMusic size={20} className="text-primary" />
                            </div>
                            <Badge variant="outline">All Time</Badge>
                          </div>
                          <div className="stat-value">35</div>
                          <div className="stat-label">Kits Downloaded</div>
                        </div>

                        <div className="stat-card">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Heart size={20} className="text-primary" />
                            </div>
                          </div>
                          <div className="stat-value">8</div>
                          <div className="stat-label">Favorite Kits</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <h2 className="text-xl font-bold mb-4">Recent Downloads</h2>
                      <div className="space-y-4">
                        {recentDownloads.map((download, index) => (
                          <Card key={index} className="glass-card hover-lift">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 relative rounded overflow-hidden shrink-0">
                                  <Image
                                    src={download.image || "/placeholder.svg"}
                                    alt={download.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{download.title}</h3>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary" className="text-xs">
                                      {download.type}
                                    </Badge>
                                    <span>•</span>
                                    <span>Downloaded {download.date}</span>
                                  </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                  <Link href={`/kits/${download.id}`}>View Kit</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-4 text-center">
                        <Button variant="outline" onClick={() => setActiveTab("downloads")} className="glass">
                          View All Downloads
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedKits.map((kit, index) => (
                          <Card key={index} className="glass-card hover-lift">
                            <div className="flex h-full">
                              <div className="w-1/3 relative">
                                <Image
                                  src={kit.image || "/placeholder.svg"}
                                  alt={kit.title}
                                  fill
                                  className="object-cover rounded-l-lg"
                                />
                              </div>
                              <div className="w-2/3 p-4 flex flex-col">
                                <h3 className="font-medium">{kit.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{kit.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {kit.type}
                                  </Badge>
                                  <span>•</span>
                                  <span>{kit.fileCount} files</span>
                                </div>
                                <div className="mt-auto">
                                  <Button asChild variant="premium" size="sm" className="w-full">
                                    <Link href={`/kits/${kit.id}`}>Download Now</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === "downloads" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <h1 className="text-3xl font-bold mb-2 neon-text">My Downloads</h1>
                      <p className="text-muted-foreground mb-6">All your downloaded kits in one place</p>

                      <Tabs defaultValue="all" className="mb-6">
                        <TabsList className="glass">
                          <TabsTrigger value="all">All Downloads</TabsTrigger>
                          <TabsTrigger value="drums">Drum Kits</TabsTrigger>
                          <TabsTrigger value="melodies">Melody Loops</TabsTrigger>
                          <TabsTrigger value="oneshots">One Shots</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-4">
                          <div className="space-y-4">
                            {allDownloads.map((download, index) => (
                              <Card key={index} className="glass-card hover-lift">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 relative rounded overflow-hidden shrink-0">
                                      <Image
                                        src={download.image || "/placeholder.svg"}
                                        alt={download.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium">{download.title}</h3>
                                      <p className="text-sm text-muted-foreground line-clamp-1">
                                        {download.description}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                          {download.type}
                                        </Badge>
                                        <span>•</span>
                                        <span>Downloaded {download.date}</span>
                                        <span>•</span>
                                        <span>{download.fileCount} files</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                      <Button asChild variant="outline" size="sm">
                                        <Link href={`/kits/${download.id}`}>View Kit</Link>
                                      </Button>
                                      <Button variant="premium" size="sm" className="gap-1">
                                        <Download size={14} />
                                        <span>Download Again</span>
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>

                        {/* Other tab contents would follow the same pattern */}
                      </Tabs>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <h1 className="text-3xl font-bold mb-2 neon-text">Account Settings</h1>
                      <p className="text-muted-foreground mb-6">Manage your account preferences and profile</p>

                      <Card className="glass-card mb-6">
                        <CardHeader>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>Update your account profile information</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3 flex flex-col items-center">
                              <Avatar className="h-24 w-24 border-2 border-primary/20 mb-4">
                                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl">JS</AvatarFallback>
                              </Avatar>
                              <Button variant="outline" size="sm" className="glass">
                                Change Avatar
                              </Button>
                            </div>
                            <div className="md:w-2/3 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">First Name</label>
                                  <input
                                    type="text"
                                    defaultValue="John"
                                    className="w-full h-10 px-3 rounded-md glass-input"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Last Name</label>
                                  <input
                                    type="text"
                                    defaultValue="Smith"
                                    className="w-full h-10 px-3 rounded-md glass-input"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input
                                  type="email"
                                  defaultValue="john.smith@example.com"
                                  className="w-full h-10 px-3 rounded-md glass-input"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                  rows={3}
                                  defaultValue="Music producer based in Los Angeles. I love creating trap and lo-fi beats."
                                  className="w-full p-3 rounded-md glass-input"
                                />
                              </div>
                              <Button variant="premium" className="mt-2">
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card mb-6">
                        <CardHeader>
                          <CardTitle>Password</CardTitle>
                          <CardDescription>Update your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Current Password</label>
                              <input type="password" className="w-full h-10 px-3 rounded-md glass-input" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">New Password</label>
                              <input type="password" className="w-full h-10 px-3 rounded-md glass-input" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Confirm New Password</label>
                              <input type="password" className="w-full h-10 px-3 rounded-md glass-input" />
                            </div>
                            <Button variant="premium">Update Password</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle>Notification Preferences</CardTitle>
                          <CardDescription>Manage your notification settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">New Kit Releases</h3>
                                <p className="text-sm text-muted-foreground">Get notified when new kits are released</p>
                              </div>
                              <div
                                className="h-6 w-11 bg-primary rounded-full relative toggle-switch"
                                data-state="checked"
                              >
                                <div className="toggle-switch-thumb"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">Download Reminders</h3>
                                <p className="text-sm text-muted-foreground">
                                  Remind me about kits I've viewed but not downloaded
                                </p>
                              </div>
                              <div className="h-6 w-11 bg-muted rounded-full relative toggle-switch">
                                <div className="toggle-switch-thumb"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">Marketing Emails</h3>
                                <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                              </div>
                              <div
                                className="h-6 w-11 bg-primary rounded-full relative toggle-switch"
                                data-state="checked"
                              >
                                <div className="toggle-switch-thumb"></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

// Sample data
const recentDownloads = [
  {
    id: "midnight-drums",
    title: "Midnight Drums",
    description: "Dark and atmospheric drum kit with punchy kicks and crisp snares",
    image: "/placeholder.svg?height=48&width=48",
    type: "Drum Kit",
    date: "2 days ago",
    fileCount: 45,
  },
  {
    id: "neon-melodies",
    title: "Neon Melodies",
    description: "Vibrant melodic loops inspired by synthwave and retrowave",
    image: "/placeholder.svg?height=48&width=48",
    type: "Melody Loops",
    date: "1 week ago",
    fileCount: 32,
  },
  {
    id: "lofi-dreams",
    title: "Lo-Fi Dreams",
    description: "Mellow and nostalgic lo-fi samples and loops",
    image: "/placeholder.svg?height=48&width=48",
    type: "Sample Pack",
    date: "2 weeks ago",
    fileCount: 38,
  },
]

const recommendedKits = [
  {
    id: "future-bass-elements",
    title: "Future Bass Elements",
    description: "Modern future bass sounds with energetic synths and drums",
    image: "/placeholder.svg?height=120&width=120",
    type: "Sample Pack",
    fileCount: 52,
  },
  {
    id: "analog-percussion",
    title: "Analog Percussion",
    description: "Warm analog drum sounds recorded from vintage hardware",
    image: "/placeholder.svg?height=120&width=120",
    type: "Drum Kit",
    fileCount: 40,
  },
]

const allDownloads = [
  {
    id: "midnight-drums",
    title: "Midnight Drums",
    description: "Dark and atmospheric drum kit with punchy kicks and crisp snares",
    image: "/placeholder.svg?height=64&width=64",
    type: "Drum Kit",
    date: "2 days ago",
    fileCount: 45,
  },
  {
    id: "neon-melodies",
    title: "Neon Melodies",
    description: "Vibrant melodic loops inspired by synthwave and retrowave",
    image: "/placeholder.svg?height=64&width=64",
    type: "Melody Loops",
    date: "1 week ago",
    fileCount: 32,
  },
  {
    id: "lofi-dreams",
    title: "Lo-Fi Dreams",
    description: "Mellow and nostalgic lo-fi samples and loops",
    image: "/placeholder.svg?height=64&width=64",
    type: "Sample Pack",
    date: "2 weeks ago",
    fileCount: 38,
  },
  {
    id: "urban-essentials",
    title: "Urban Essentials",
    description: "Essential sounds for hip-hop and trap production",
    image: "/placeholder.svg?height=64&width=64",
    type: "Sample Pack",
    date: "3 weeks ago",
    fileCount: 60,
  },
  {
    id: "ambient-textures",
    title: "Ambient Textures",
    description: "Ethereal and atmospheric textures for ambient and cinematic music",
    image: "/placeholder.svg?height=64&width=64",
    type: "FX",
    date: "1 month ago",
    fileCount: 25,
  },
]

