"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = theme === "dark"

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative overflow-hidden rounded-full glass-card hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300"
      >
        <div className="h-5 w-5"></div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden rounded-full glass-card hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300 neon-glow"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
              className="absolute inset-0"
            >
              <Moon className="h-5 w-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
              className="absolute inset-0"
            >
              <Sun className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced glow effect */}
      <motion.span
        className="absolute inset-0 pointer-events-none rounded-full"
        initial={false}
        animate={{
          boxShadow: isDark
            ? "inset 0 0 0 2px rgba(167, 94, 255, 0.3), 0 0 10px rgba(167, 94, 255, 0.5)"
            : "inset 0 0 0 2px rgba(147, 51, 234, 0.3), 0 0 10px rgba(147, 51, 234, 0.3)",
        }}
        transition={{ duration: 0.5 }}
      />
    </Button>
  )
}

