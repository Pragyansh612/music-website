"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, User, Lock, Shield, Bell, Upload, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    setPasswordError("")
    // Simulate API call
    setTimeout(() => {
      setIsPasswordDialogOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1000)
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
            <h1 className="text-3xl font-bold tracking-tight neon-text">Admin Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          <Button variant="premium" size="sm" className="gap-1" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <Save size={16} />
            )}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="glass">
              <TabsTrigger value="account" className="gap-1">
                <User size={14} className="hidden md:block" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-1">
                <Lock size={14} className="hidden md:block" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1">
                <Bell size={14} className="hidden md:block" />
                <span>Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details and profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center text-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Admin" />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">AD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 w-full">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <Upload size={14} />
                          <span>Upload Photo</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                          <span>Remove Photo</span>
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" className="glass-input" defaultValue="Admin" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" className="glass-input" defaultValue="User" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input id="display-name" className="glass-input" defaultValue="Admin" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" className="glass-input" defaultValue="admin@prodbyshyrap.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="glass-input w-full min-h-[100px] rounded-md p-3"
                          defaultValue="Administrator of ProdByShyrap. Managing beats, kits, and user accounts."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Admin Permissions</CardTitle>
                  <CardDescription>Manage your admin access and permissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Admin Role</Label>
                      <p className="text-sm text-muted-foreground">Your current role in the system.</p>
                    </div>
                    <Badge className="bg-primary/90 hover:bg-primary/80 px-3 py-1 text-sm">Super Admin</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Permission Settings</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="manage-kits">Manage Kits</Label>
                        <p className="text-sm text-muted-foreground">Create, edit, and delete kits and sample packs.</p>
                      </div>
                      <Switch id="manage-kits" defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="manage-users">Manage Users</Label>
                        <p className="text-sm text-muted-foreground">View, edit, and manage user accounts.</p>
                      </div>
                      <Switch id="manage-users" defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="manage-settings">Manage Settings</Label>
                        <p className="text-sm text-muted-foreground">Edit website settings and configurations.</p>
                      </div>
                      <Switch id="manage-settings" defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="view-analytics">View Analytics</Label>
                        <p className="text-sm text-muted-foreground">Access website analytics and reports.</p>
                      </div>
                      <Switch id="view-analytics" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Current Password</Label>
                        <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                      </div>
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card">
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and a new password to update your credentials.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input
                                id="current-password"
                                type="password"
                                className="glass-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input
                                id="new-password"
                                type="password"
                                className="glass-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirm New Password</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                className="glass-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                            </div>
                            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handlePasswordChange}>Update Password</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-2fa">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                      </div>
                      <Switch id="enable-2fa" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Login Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Current Session</div>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • 192.168.1.1</p>
                          <p className="text-xs text-muted-foreground">Started 2 hours ago</p>
                        </div>
                        <Badge className="bg-primary/90 hover:bg-primary/80">Active</Badge>
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Previous Session</div>
                          <p className="text-sm text-muted-foreground">Safari on macOS • 192.168.1.2</p>
                          <p className="text-xs text-muted-foreground">Ended 2 days ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                    <Shield size={14} className="mr-2" />
                    <span>Log Out of All Devices</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications and alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-new-user">New User Registration</Label>
                        <p className="text-sm text-muted-foreground">Receive an email when a new user registers.</p>
                      </div>
                      <Switch id="notify-new-user" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-new-download">New Download</Label>
                        <p className="text-sm text-muted-foreground">Receive an email when a kit is downloaded.</p>
                      </div>
                      <Switch id="notify-new-download" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-contact-form">Contact Form Submission</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive an email when someone submits the contact form.
                        </p>
                      </div>
                      <Switch id="notify-contact-form" defaultChecked />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-system-updates">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system updates and maintenance.
                        </p>
                      </div>
                      <Switch id="notify-system-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-security-alerts">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about security issues and alerts.
                        </p>
                      </div>
                      <Switch id="notify-security-alerts" defaultChecked />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Marketing Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-newsletter">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive our monthly newsletter with updates and tips.
                        </p>
                      </div>
                      <Switch id="notify-newsletter" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-promotions">Promotions</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about promotions and special offers.
                        </p>
                      </div>
                      <Switch id="notify-promotions" />
                    </div>
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

