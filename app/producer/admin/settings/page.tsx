"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Globe, Bell, Palette, Image, Layout, SettingsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function WebsiteSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
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
            <h1 className="text-3xl font-bold tracking-tight neon-text">Website Settings</h1>
            <p className="text-muted-foreground">Customize your website appearance, content, and functionality.</p>
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
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass w-full md:w-auto grid grid-cols-2 md:grid-cols-5 md:inline-flex">
              <TabsTrigger value="general" className="gap-1">
                <SettingsIcon size={14} className="hidden md:block" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-1">
                <Palette size={14} className="hidden md:block" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="homepage" className="gap-1">
                <Layout size={14} className="hidden md:block" />
                <span>Homepage</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-1">
                <Globe size={14} className="hidden md:block" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1">
                <Bell size={14} className="hidden md:block" />
                <span>Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your website's basic information and settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" className="glass-input" defaultValue="ProdByShyrap" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea
                      id="site-description"
                      className="glass-input min-h-[100px]"
                      defaultValue="Premium beats and sample packs for music producers."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" className="glass-input" defaultValue="contact@prodbyshyrap.com" />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Site Features</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-downloads">Enable Downloads</Label>
                        <p className="text-sm text-muted-foreground">Allow users to download kits from the website.</p>
                      </div>
                      <Switch id="enable-downloads" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-comments">Enable Comments</Label>
                        <p className="text-sm text-muted-foreground">Allow users to comment on kits and posts.</p>
                      </div>
                      <Switch id="enable-comments" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-registration">Enable User Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register on the website.</p>
                      </div>
                      <Switch id="enable-registration" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input id="primary-color" className="glass-input" defaultValue="#9333EA" />
                          <div className="h-10 w-10 rounded-md bg-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accent-color">Accent Color</Label>
                        <div className="flex items-center gap-2">
                          <Input id="accent-color" className="glass-input" defaultValue="#4C1D95" />
                          <div className="h-10 w-10 rounded-md bg-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Layout Settings</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-glassmorphism">Glassmorphism Effects</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable glass-like UI elements throughout the site.
                        </p>
                      </div>
                      <Switch id="enable-glassmorphism" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-animations">Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable animations and transitions throughout the site.
                        </p>
                      </div>
                      <Switch id="enable-animations" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-dark-mode">Dark Mode Toggle</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to switch between light and dark mode.
                        </p>
                      </div>
                      <Switch id="enable-dark-mode" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homepage" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Homepage Settings</CardTitle>
                  <CardDescription>Customize the content displayed on your homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Hero Section</h3>
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Hero Title</Label>
                      <Input id="hero-title" className="glass-input" defaultValue="Premium Beats & Sample Packs" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                      <Input id="hero-subtitle" className="glass-input" defaultValue="Elevate Your Music Production" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta">Call to Action Text</Label>
                      <Input id="hero-cta" className="glass-input" defaultValue="Explore Kits" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-image">Hero Background Image</Label>
                      <div className="flex items-center gap-2">
                        <Input id="hero-image" className="glass-input" defaultValue="/images/hero-background.jpg" />
                        <Button variant="outline" size="sm">
                          <Image size={14} className="mr-2" />
                          Browse
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Featured Content</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-featured-kits">Featured Kits Section</Label>
                        <p className="text-sm text-muted-foreground">
                          Display a selection of featured kits on the homepage.
                        </p>
                      </div>
                      <Switch id="show-featured-kits" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="featured-kits-title">Featured Kits Title</Label>
                      <Input id="featured-kits-title" className="glass-input" defaultValue="Featured Kits" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="featured-kits-count">Number of Featured Kits</Label>
                      <Input id="featured-kits-count" type="number" className="glass-input" defaultValue="6" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Announcement Banner</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-announcement">Show Announcement</Label>
                        <p className="text-sm text-muted-foreground">
                          Display an announcement banner at the top of the homepage.
                        </p>
                      </div>
                      <Switch id="show-announcement" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement-text">Announcement Text</Label>
                      <Input
                        id="announcement-text"
                        className="glass-input"
                        defaultValue="🔥 New Trap Universe Kit now available! Limited time 20% off."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement-link">Announcement Link</Label>
                      <Input id="announcement-link" className="glass-input" defaultValue="/kits/5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize your website for search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Default Meta Title</Label>
                    <Input
                      id="meta-title"
                      className="glass-input"
                      defaultValue="ProdByShyrap | Premium Beats & Sample Packs"
                    />
                    <p className="text-xs text-muted-foreground">Recommended length: 50-60 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Default Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      className="glass-input min-h-[100px]"
                      defaultValue="Discover premium beats, drum kits, and sample packs for music producers. High-quality sounds for hip-hop, trap, lo-fi, and more."
                    />
                    <p className="text-xs text-muted-foreground">Recommended length: 150-160 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-keywords">Default Meta Keywords</Label>
                    <Input
                      id="meta-keywords"
                      className="glass-input"
                      defaultValue="beats, sample packs, drum kits, music production, hip-hop, trap, lo-fi"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Media</h3>
                    <div className="space-y-2">
                      <Label htmlFor="og-title">Open Graph Title</Label>
                      <Input
                        id="og-title"
                        className="glass-input"
                        defaultValue="ProdByShyrap | Premium Beats & Sample Packs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="og-description">Open Graph Description</Label>
                      <Textarea
                        id="og-description"
                        className="glass-input min-h-[100px]"
                        defaultValue="Discover premium beats, drum kits, and sample packs for music producers. High-quality sounds for hip-hop, trap, lo-fi, and more."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="og-image">Open Graph Image</Label>
                      <div className="flex items-center gap-2">
                        <Input id="og-image" className="glass-input" defaultValue="/images/og-image.jpg" />
                        <Button variant="outline" size="sm">
                          <Image size={14} className="mr-2" />
                          Browse
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced SEO</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-sitemap">Generate Sitemap</Label>
                        <p className="text-sm text-muted-foreground">Automatically generate and update sitemap.xml</p>
                      </div>
                      <Switch id="enable-sitemap" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-robots">Generate robots.txt</Label>
                        <p className="text-sm text-muted-foreground">Automatically generate and update robots.txt</p>
                      </div>
                      <Switch id="enable-robots" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-structured-data">Structured Data</Label>
                        <p className="text-sm text-muted-foreground">
                          Add structured data markup for rich search results
                        </p>
                      </div>
                      <Switch id="enable-structured-data" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure email notifications and announcements.</CardDescription>
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
                    <h3 className="text-lg font-medium">User Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="user-welcome-email">Welcome Email</Label>
                        <p className="text-sm text-muted-foreground">Send a welcome email to new users.</p>
                      </div>
                      <Switch id="user-welcome-email" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="welcome-email-subject">Welcome Email Subject</Label>
                      <Input
                        id="welcome-email-subject"
                        className="glass-input"
                        defaultValue="Welcome to ProdByShyrap!"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="welcome-email-template">Welcome Email Template</Label>
                      <Textarea
                        id="welcome-email-template"
                        className="glass-input min-h-[150px]"
                        defaultValue="Hi {{name}},\n\nWelcome to ProdByShyrap! We're excited to have you join our community of music producers.\n\nGet started by exploring our premium kits and sample packs.\n\nBest,\nThe ProdByShyrap Team"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Marketing Emails</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-newsletter">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Allow users to subscribe to your newsletter.</p>
                      </div>
                      <Switch id="enable-newsletter" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-provider">Newsletter Provider</Label>
                      <Input id="newsletter-provider" className="glass-input" defaultValue="Mailchimp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-api-key">API Key</Label>
                      <Input
                        id="newsletter-api-key"
                        className="glass-input"
                        type="password"
                        defaultValue="••••••••••••••••"
                      />
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

