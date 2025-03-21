import Link from "next/link"
import { AtSign, Instagram, MapPin, MessageSquare, Twitter, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
              <p className="text-xl text-muted-foreground">
                Have questions, feedback, or collaboration ideas? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Send a Message</CardTitle>
                  <CardDescription>
                    Fill out our contact form and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <AtSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>
                    <a href="mailto:info@prodbyshyrap.com" className="text-primary hover:underline">
                      info@prodbyshyrap.com
                    </a>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Los Angeles, California</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>Fill out the form below and we'll respond within 24-48 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message here..." rows={5} />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="backdrop-blur-lg bg-background/80 border border-border">
                  <CardHeader>
                    <CardTitle>Connect With Us</CardTitle>
                    <CardDescription>
                      Follow us on social media for updates, behind-the-scenes content, and more.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <Link
                        href="https://youtube.com"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                          <Youtube className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">YouTube</h3>
                          <p className="text-sm text-muted-foreground">Tutorials, previews, and more</p>
                        </div>
                      </Link>

                      <Link
                        href="https://instagram.com"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                          <Instagram className="h-5 w-5 text-pink-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Instagram</h3>
                          <p className="text-sm text-muted-foreground">Daily updates and community features</p>
                        </div>
                      </Link>

                      <Link
                        href="https://twitter.com"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Twitter className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Twitter</h3>
                          <p className="text-sm text-muted-foreground">News, releases, and conversations</p>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-lg bg-background/80 border border-border">
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>When you can expect to hear back from us.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

