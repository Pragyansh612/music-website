"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/kits", label: "Kits" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/licensing", label: "Licensing" },
  // { href: "/account", label: "My Account" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  
  const menuVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 glass-card flex items-center  justify-center hover:bg-white/40 dark:hover:bg-black/40"
        >
          <Menu className="h-10 w-10" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="pr-0 bg-background/95 backdrop-blur-md dark:bg-background/90 border-l border-white/20 dark:border-white/10"
      >
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold text-xl">
              <span className="gradient-text">ProdBy</span>Shyrap
            </span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 mt-8 px-7">
          <AnimatePresence>
            {navItems.map((item, i) => (
              <motion.div key={item.href} custom={i} initial="hidden" animate="visible" variants={menuVariants}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary py-2 flex items-center",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {/* {item.label === "My Account" && <User size={18} className="mr-2" />} */}
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div custom={navItems.length} initial="hidden" animate="visible" variants={menuVariants}>
            <Button asChild className="mt-4 w-full premium-btn relative overflow-hidden group">
              <Link href="/kits" onClick={() => setOpen(false)}>
                <span className="relative z-10">Download Kits</span>
                <span className="absolute inset-0 w-full h-full bg-primary/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              </Link>
            </Button>
          </motion.div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}