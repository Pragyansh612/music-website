"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BarChart3,
  Box,
  FileText,
  Home,
  LogOut,
  Music,
  Package,
  Settings,
  Users,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle logout
  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("adminAuthenticated")
    document.cookie = "adminAuthenticated=; Max-Age=0; path=/;"
    router.push("/producer/admin-access")
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    {
      title: "Dashboard",
      href: "/producer/admin/dashboard",
      icon: <BarChart3 size={20} />,
    },
    {
      title: "Manage Kits",
      href: "/producer/admin/kits",
      icon: <Music size={20} />,
    },
    {
      title: "Manage Users",
      href: "/producer/admin/users",
      icon: <Users size={20} />,
    },
    {
      title: "Manage Downloads",
      href: "/producer/admin/downloads",
      icon: <Package size={20} />,
    },
    {
      title: "Website Settings",
      href: "/producer/admin/settings",
      icon: <Settings size={20} />,
    },
    {
      title: "Admin Profile",
      href: "/producer/admin/profile",
      icon: <User size={20} />,
    },
    {
      title: "Logs & Activity",
      href: "/producer/admin/logs",
      icon: <FileText size={20} />,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-header border-b border-white/10 dark:border-white/5">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/producer/admin/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md"></div>
                <div className="relative bg-background/50 dark:bg-background/30 p-1.5 rounded-full border border-primary/20 transition-all duration-300 neon-glow">
                  <Box className="h-5 w-5 text-primary" />
                </div>
              </div>
              <span className="font-bold text-lg hidden md:inline-block">
                <span className="gradient-text neon-text">Admin</span> Panel
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:flex items-center gap-1"
            >
              <Home size={16} />
              <span>View Site</span>
            </Link>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="cursor-pointer py-3">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Package size={16} className="text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">New kit download</p>
                          <p className="text-xs text-muted-foreground">
                            "Midnight Drums" has been downloaded 50 times today
                          </p>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center font-medium">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Admin</span>
                    <ChevronDown size={16} />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/producer/admin/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/producer/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut size={16} className="mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-full w-3/4 max-w-xs glass-card border-r border-white/10 dark:border-white/5 p-4"
        >
          <div className="flex items-center justify-between mb-6">
            <Link href="/producer/admin/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md"></div>
                <div className="relative bg-background/50 dark:bg-background/30 p-1.5 rounded-full border border-primary/20 transition-all duration-300 neon-glow">
                  <Box className="h-5 w-5 text-primary" />
                </div>
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text neon-text">Admin</span> Panel
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </Button>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className={`hidden lg:block fixed inset-y-0 pt-16 glass-card border-r border-white/10 dark:border-white/5 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="h-full flex flex-col p-4 overflow-y-auto">
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.icon}
                  <span className={isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}>{item.title}</span>
                </Link>
              ))}
            </nav>
            <Separator className="my-4" />
            <Button
              variant="outline"
              className={`justify-start gap-2 text-destructive hover:text-destructive ${isSidebarOpen ? "" : "px-2"}`}
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className={isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}>Log Out</span>
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <div className="container py-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

