"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, Edit, Trash2, FileMusic } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Kit {
    id: string;
    name: string;
    description: string;
    category: string;
    fileCount: number;
    downloads: number;
    status: string;
    createdAt: string;
    image: string;
  }

export const OrderCard = ({ kit, onDeleteClick }: { kit: Kit; onDeleteClick: (kitId: string) => void }) => {
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "drum-kit":
        return "Drum Kit"
      case "melody-loops":
        return "Melody Loops"
      case "sample-pack":
        return "Sample Pack"
      default:
        return category
    }
  }

  const formattedDate = new Date(kit.createdAt).toLocaleDateString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="glass-card overflow-hidden hover-lift h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={kit.image || "/placeholder.svg?height=200&width=400"}
            alt={kit.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge className="bg-primary/90 hover:bg-primary/80">
              {getCategoryLabel(kit.category)}
            </Badge>
            <Badge variant="outline" className="bg-black/50 border-white/20 text-white">
              {kit.fileCount} files
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{kit.name}</CardTitle>
          <CardDescription className="line-clamp-2">{kit.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download size={14} />
              <span>{kit.downloads} downloads</span>
            </div>
            <div className="text-muted-foreground">{new Date(kit.createdAt).toLocaleDateString()}</div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex items-center gap-2 w-full">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/producer/admin/kits/${kit.id}`}>
                <FileMusic size={14} className="mr-1" />
                View
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/producer/admin/kits/${kit.id}/edit`}>
                <Edit size={14} className="mr-1" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDeleteClick(kit.id)}
            >
              <Trash2 size={14} />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}