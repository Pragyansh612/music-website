"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/kits", label: "Kits" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/licensing", label: "Licensing" },
]

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-6 lg:space-x-8", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "relative text-sm font-medium transition-colors hover:text-primary group",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-300 ease-in-out">
            {pathname === item.href && (
              <motion.span
                layoutId="underline"
                className="absolute top-0 left-0 h-full w-full bg-primary"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </span>
        </Link>
      ))}
    </nav>
  )
}

