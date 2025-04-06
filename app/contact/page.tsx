"use client"

import { useState } from "react"
import Link from "next/link"
import { AtSign, Instagram, MapPin, MessageSquare, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e:any) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value:any) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: "prodbyshyrap@gmail.com"
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you soon.",
          // variant: "success"
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        console.error("Error:", data);
        toast({
          title: "Something went wrong",
          description: data.error || "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
              <p className="text-xl text-muted-foreground">
                Have questions, feedback, or collaboration ideas? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-lg bg-background/80 border border-border hover:shadow-md transition-all">
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

              <Card className="backdrop-blur-lg bg-background/80 border border-border hover:shadow-md transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <AtSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>
                    <a href="mailto:prodbyshyrap@gmail.com" className="text-primary hover:underline">
                      prodbyshyrap@gmail.com
                    </a>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-lg bg-background/80 border border-border hover:shadow-md transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>India</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="backdrop-blur-lg bg-background/80 border border-border hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>Fill out the form below and we'll respond within 24-48 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select onValueChange={handleSelectChange} value={formData.subject} required>
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
                      <Textarea 
                        id="message" 
                        placeholder="Your message here..." 
                        rows={5} 
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="backdrop-blur-lg bg-background/80 border border-border hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle>Connect With Us</CardTitle>
                    <CardDescription>
                      Follow us on social media for updates, behind-the-scenes content, and more.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <Link
                        href="https://www.youtube.com/@prodbyshyrap"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
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
                        href="https://www.instagram.com/shyrap21/"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                          <Instagram className="h-5 w-5 text-pink-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Instagram</h3>
                          <p className="text-sm text-muted-foreground">Daily updates and community features</p>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-lg bg-background/80 border border-border hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>When you can expect to hear back from us.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM IST</span>
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