"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, Headphones, Music, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrderCardProps {
  kit: {
    id: string
    title: string
    description: string
    image: string
    fileCount: number
    type: string
    bpm?: string
  }
  variant?: "simple" | "detailed"
  className?: string
}

export function OrderCard({ kit, variant = "simple", className = "" }: OrderCardProps) {
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
    <motion.div variants={itemVariants}>
      <Link href={`/kits/${kit.id}`} className="block h-full">
        <Card className={`glass-card overflow-hidden group h-full flex flex-col hover-lift card-3d ${className}`}>
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={kit.image || "/placeholder.svg"}
              alt={kit.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {variant === "detailed" && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="glass">
                  {kit.type}
                </Badge>
              </div>
            )}
          </div>
          
          <CardHeader className="card-3d-content">
            <CardTitle className="group-hover:text-primary transition-colors duration-300">
              {kit.title}
            </CardTitle>
            <CardDescription>{kit.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-grow card-3d-content">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package size={16} />
              <span>{kit.fileCount} files</span>
              <span className="mx-2">•</span>
              <Music size={16} />
              <span>{variant === "detailed" && kit.bpm ? kit.bpm : kit.type}</span>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between card-3d-content">
            <Button variant="outline" size="sm" className="glass">
              <Headphones size={16} className="mr-1" />
              Preview
            </Button>
            
            {variant === "detailed" ? (
              <Button variant="outline" size="sm" className="glass relative overflow-hidden group/btn">
                <span className="relative z-10">Download</span>
                <Download size={16} className="relative z-10 ml-1" />
                <span className="absolute inset-0 w-full h-full bg-primary/80 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="glass">
                <span className="relative z-10">Download</span>
                <Download size={16} className="relative z-10 ml-1" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}