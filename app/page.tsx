"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Download, Headphones, Music, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderCard } from "@/components/order-card" // Import the OrderCard component

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden hero-section animated-bg">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 backdrop-blur-xl" />

            {/* Enhanced animated elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-float opacity-50"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-float opacity-30"
              style={{ animationDelay: "-3s" }}
            ></div>

            {/* Additional animated elements */}
            <div
              className="absolute top-1/3 right-1/3 w-48 h-48 bg-accent/20 rounded-full filter blur-3xl animate-float opacity-40"
              style={{ animationDelay: "-1.5s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl animate-float opacity-20"
              style={{ animationDelay: "-4.5s" }}
            ></div>
          </div>

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Free Music Kits for <span className="gradient-text neon-text">Producers</span>
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                High-quality drum kits, loops, and one-shots to elevate your productions. 100% free, no strings
                attached.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button asChild variant="outline" size="lg" className="">
                  <Link href="/kits">
                    <span className="relative z-10">Browse Kits</span>
                    <ArrowRight size={16} className="relative z-10 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Kits Section */}
        <section className="py-16 bg-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 noise"></div>
          <div className="container relative">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Kits</h2>
                <p className="text-muted-foreground">Our most popular and latest releases</p>
              </div>
              <Button asChild variant="outline" className="glass shimmer">
                <Link href="/kits">View All Kits</Link>
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {featuredKits.map((kit) => (
                <OrderCard key={kit.id} kit={kit} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Free Kits Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 noise"></div>
          <div className="container relative">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why Free Kits?</h2>
              <p className="text-xl text-muted-foreground">
                We believe in supporting the producer community by providing high-quality resources without barriers.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {reasons.map((reason, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="glass-card h-full hover-lift">
                    <CardHeader>
                      <motion.div
                        className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 neon-glow"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {reason.icon}
                      </motion.div>
                      <CardTitle className="neon-text">{reason.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{reason.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 noise"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="container relative">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Elevate Your Productions?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of producers using our free kits to create amazing music.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button asChild variant="premium" size="lg" className="btn-shine">
                  <Link href="/kits">
                    <span className="relative z-10">Get Started Now</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

// Sample data
const featuredKits = [
  {
    id: "midnight-drums",
    title: "Midnight Drums",
    description: "Dark and atmospheric drum kit with punchy kicks and crisp snares",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 45,
    type: "Drum Kit",
  },
  {
    id: "neon-melodies",
    title: "Neon Melodies",
    description: "Vibrant melodic loops inspired by synthwave and retrowave",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 32,
    type: "Melody Loops",
  },
  {
    id: "urban-essentials",
    title: "Urban Essentials",
    description: "Essential sounds for hip-hop and trap production",
    image: "/placeholder.svg?height=300&width=400",
    fileCount: 60,
    type: "Sample Pack",
  },
]

const reasons = [
  {
    icon: <Music className="h-6 w-6 text-primary" />,
    title: "Community Support",
    description:
      "We believe in giving back to the producer community and helping new artists create without financial barriers.",
  },
  {
    icon: <Headphones className="h-6 w-6 text-primary" />,
    title: "Quality Over Profit",
    description:
      "Our focus is on creating the highest quality sounds rather than maximizing profits. Your music deserves the best.",
  },
  {
    icon: <Download className="h-6 w-6 text-primary" />,
    title: "No Strings Attached",
    description:
      "All our kits are truly free to use in your productions with clear licensing terms and no hidden fees.",
  },
]