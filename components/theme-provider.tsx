"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Add smooth transition when theme changes
  React.useEffect(() => {
    const body = document.body

    // Add transition class to body for smooth theme changes
    body.classList.add("theme-transition")

    // Handle theme change animation
    const handleThemeChange = () => {
      // Add animation class
      body.classList.add("theme-changing")

      // Remove animation class after transition completes
      setTimeout(() => {
        body.classList.remove("theme-changing")
      }, 1000)
    }

    // Listen for theme changes
    window.addEventListener("themechange", handleThemeChange)

    // Set mounted to true
    setMounted(true)

    return () => {
      window.removeEventListener("themechange", handleThemeChange)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

