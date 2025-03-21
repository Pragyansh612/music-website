"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Download, Star, Play, Pause, Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EnhancedHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Auto-rotate featured kits
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredKits.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/placeholder.svg?height=1080&width=1920" 
            alt="Music Production Studio" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        
        <motion.div 
          className="container relative z-10 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="max-w-2xl space-y-6">
            <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-sm">
              Premium Sound Kits
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight neon-text">
              Elevate Your Music Production
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover premium beats, drum kits, and sample packs crafted for professional producers. High-quality sounds for hip-hop, trap, lo-fi, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" variant="premium" className="group">
                <Link href="/kits">
                  Explore Kits
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="backdrop-blur-sm bg-background/30">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Featured Kits Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text">Featured Kits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most popular sound kits and sample packs, curated for professional producers.
            </p>
          </motion.div>
          
          <div className="relative h-[500px] overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="relative h-full w-full">
                  <Image 
                    src={featuredKits[currentSlide].image || "/placeholder.svg"} 
                    alt={featuredKits[currentSlide].name} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-4">
                        <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-sm">
                          {featuredKits[currentSlide].category}
                        </Badge>
                        <h3 className="text-3xl md:text-4xl font-bold neon-text">
                          {featuredKits[currentSlide].name}
                        </h3>
                        <p className="text-muted-foreground max-w-xl">
                          {featuredKits[currentSlide].description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-5 w-5 ${i < featuredKits[currentSlide].rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {featuredKits[currentSlide].downloads} downloads
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="premium" size="lg" asChild>
                          <Link href={`/kits/${featuredKits[currentSlide].id}`}>
                            <Download className="mr-2 h-5 w-5" />
                            Download Now
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="backdrop-blur-sm bg-background/30"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="mr-2 h-5 w-5" />
                              Pause Preview
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-5 w-5" />
                              Play Preview
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="backdrop-blur-sm bg-background/30"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {featuredKits.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? "w-8 bg-primary" : "w-2 bg-muted"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text">Browse Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect sounds for your next production.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.href} className="block h-full">
                  <Card className="glass-card overflow-hidden h-full hover-lift group">
                    <div className="relative aspect-video">
                      <Image 
                        src={category.image || "/placeholder.svg"} 
                        alt={category.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold">{category.name}</h3>
                        <p className="text-muted-foreground mt-2">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-muted/10">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text">What Producers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from music producers who use our sound kits.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full hover-lift">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-5 w-5 text-yellow-500 fill-yellow-500" 
                          />
                        ))}
                      </div>
                      <p className="italic mb-6">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden relative">
                        <Image 
                          src={testimonial.avatar || "/placeholder.svg"} 
                          alt={testimonial.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div 
            className="rounded-xl overflow-hidden relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.opacity: 1}}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Image 
                src="/placeholder.svg?height=600&width=1200" 
                alt="Music Production" 
                width={1200}
                height={600}
                className="object-cover w-full h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="container">
                  <div className="max-w-xl space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold neon-text">Ready to Level Up Your Productions?</h2>
                    <p className="text-xl text-muted-foreground">
                      Join thousands of producers using ProdByShyrap kits to create chart-topping beats.
                    </p>
                    <Button asChild size="lg" variant="premium" className="group">
                      <Link href="/kits">
                        Get Started Today
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Sample data
const featuredKits = [
  {
    id: "1",
    name: "Midnight Drums",
    category: "Drum Kit",
    description: "A collection of deep, atmospheric drum samples perfect for trap and hip-hop production.",
    image: "/placeholder.svg?height=600&width=1200",
    rating: 5,
    downloads: 1245,
  },
  {
    id: "2",
    name: "Lo-Fi Dreams",
    category: "Sample Pack",
    description: "Vintage-inspired samples and loops for creating chill lo-fi beats and ambient soundscapes.",
    image: "/placeholder.svg?height=600&width=1200",
    rating: 4,
    downloads: 987,
  },
  {
    id: "3",
    name: "Neon Melodies",
    category: "Melody Loops",
    description: "Bright, synthwave-inspired melody loops with retro vibes and modern production quality.",
    image: "/placeholder.svg?height=600&width=1200",
    rating: 5,
    downloads: 856,
  },
]

const categories = [
  {
    name: "Drum Kits",
    description: "Hard-hitting drums for any genre",
    image: "/placeholder.svg?height=300&width=600",
    href: "/kits?category=drum-kit",
  },
  {
    name: "Melody Loops",
    description: "Inspiring melodies to build around",
    image: "/placeholder.svg?height=300&width=600",
    href: "/kits?category=melody-loops",
  },
  {
    name: "Sample Packs",
    description: "Complete collections for producers",
    image: "/placeholder.svg?height=300&width=600",
    href: "/kits?category=sample-pack",
  },
]

const testimonials = [
  {
    name: "Alex Johnson",
    title: "Hip-Hop Producer",
    quote: "These kits have completely transformed my production workflow. The quality is unmatched!",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Sarah Williams",
    title: "EDM Artist",
    quote: "I've been using ProdByShyrap kits for all my recent tracks. The sounds are incredibly versatile.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Marcus Lee",
    title: "Lo-Fi Producer",
    quote: "The Lo-Fi Dreams kit is my go-to for creating chill beats. Absolutely worth every penny!",
    avatar: "/placeholder.svg?height=48&width=48",
  },
]

