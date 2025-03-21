"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Download, Settings, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="container py-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card className="glass-card sticky top-20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-sm text-muted-foreground">@johndoe</p>
                <Badge className="mt-2">Premium Member</Badge>

                <Separator className="my-4" />

                <nav className="w-full">
                  <ul className="space-y-2">
                    <li>
                      <Button
                        variant={activeTab === "dashboard" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("dashboard")}
                      >
                        <User size={16} />
                        <span>Dashboard</span>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "downloads" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("downloads")}
                      >
                        <Download size={16} />
                        <span>My Downloads</span>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings size={16} />
                        <span>Account Settings</span>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "notifications" ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab("notifications")}
                      >
                        <Bell size={16} />
                        <span>Notifications</span>
                      </Button>
                    </li>
                  </ul>

                  <Separator className="my-4" />

                  <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </Button>
                </nav>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Overview of your account and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/20">
                      <h4 className="text-sm font-medium text-muted-foreground">Total Downloads</h4>
                      <p className="text-3xl font-bold">24</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/20">
                      <h4 className="text-sm font-medium text-muted-foreground">Membership</h4>
                      <p className="text-3xl font-bold">Premium</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/20">
                      <h4 className="text-sm font-medium text-muted-foreground">Member Since</h4>
                      <p className="text-3xl font-bold">2023</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Download size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Downloaded "Midnight Drums" kit</p>
                          <p className="text-sm text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Download size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Downloaded "Lo-Fi Dreams" kit</p>
                          <p className="text-sm text-muted-foreground">5 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Updated profile information</p>
                          <p className="text-sm text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "downloads" && (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>My Downloads</CardTitle>
                  <CardDescription>All the kits and sample packs you've downloaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Download size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Midnight Drums</p>
                          <p className="text-sm text-muted-foreground">Downloaded 2 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download Again
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Download size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Lo-Fi Dreams</p>
                          <p className="text-sm text-muted-foreground">Downloaded 5 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download Again
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Download size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Neon Melodies</p>
                          <p className="text-sm text-muted-foreground">Downloaded 2 weeks ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <input
                      id="name"
                      className="w-full p-2 rounded-md bg-background/50 border border-border"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <input
                      id="username"
                      className="w-full p-2 rounded-md bg-background/50 border border-border"
                      defaultValue="johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <input
                      id="email"
                      className="w-full p-2 rounded-md bg-background/50 border border-border"
                      defaultValue="john.doe@example.com"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <input
                        id="current-password"
                        type="password"
                        className="w-full p-2 rounded-md bg-background/50 border border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <input
                        id="new-password"
                        type="password"
                        className="w-full p-2 rounded-md bg-background/50 border border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <input
                        id="confirm-password"
                        type="password"
                        className="w-full p-2 rounded-md bg-background/50 border border-border"
                      />
                    </div>
                  </div>

                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-kits">New Kits</Label>
                        <p className="text-sm text-muted-foreground">Get notified when new kits are available</p>
                      </div>
                      <Switch id="new-kits" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="promotions">Promotions</Label>
                        <p className="text-sm text-muted-foreground">Receive promotional offers and discounts</p>
                      </div>
                      <Switch id="promotions" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newsletter">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Subscribe to our monthly newsletter</p>
                      </div>
                      <Switch id="newsletter" defaultChecked />
                    </div>
                  </div>

                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

