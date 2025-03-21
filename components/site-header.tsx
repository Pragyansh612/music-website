"use client"

import Link from "next/link"
import { MusicIcon, User } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full glass-header"
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-4 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 transition-all duration-300"></div>
            <div className="relative bg-background/50 dark:bg-background/30 p-1.5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-300 neon-glow">
              <MusicIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <span className="font-bold hidden sm:inline-block text-lg tracking-tight">
            <span className="gradient-text neon-text">ProdBy</span>Shyrap
          </span>
        </Link>
        <MainNav className="hidden md:flex" />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-3">
            <Link
              href="/profile"
              className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <User size={18} className="text-primary" />
              <span>My Account</span>
            </Link>
            <ThemeToggle />
            {/* <Button asChild variant="premium" size="sm" className="hidden sm:flex btn-shine">
              <Link href="/kits">
                <span className="relative z-10 ">Download Kits</span>
              </Link>
            </Button> */}
          </nav>
        </div>
        <MobileNav />
      </div>
    </motion.header>
  )
}

