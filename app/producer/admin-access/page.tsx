'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, User } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Check if we were redirected from somewhere
  const from = searchParams.get('from') || '/producer/admin/dashboard'

  // Check if user is already logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Full session structure:', JSON.stringify(session, null, 2))
      console.log('User structure:', JSON.stringify(session?.user, null, 2))
      if (session?.user?.user_metadata?.role === 'admin') {
        // Already logged in as admin, redirect back to intended destination
        router.push(from)
      }
    }

    checkSession()
  }, [from, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
  
    try {
      // Sign in with email/password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
  
      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }
  
      const user = data.user
      console.log("User data after login:", user)
  
      // Check if user has admin role
      if (user?.user_metadata?.role === 'admin' ||
        (user?.app_metadata && user.app_metadata.role === 'admin')) {
        // Use router.push instead of window.location for better client-side navigation
        router.push(from)
      } else {
        setError("You are not authorized to access the admin panel.")
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    }
  
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-float opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-float opacity-30" style={{ animationDelay: "-3s" }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-accent/20 rounded-full filter blur-3xl animate-float opacity-40" style={{ animationDelay: "-1.5s" }}></div>
      </div>

      <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="z-10 w-full max-w-md">
        <Card className="glass-card border-primary/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative h-16 w-16">
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md"></div>
                <div className="relative bg-background/50 dark:bg-background/30 p-3 rounded-full border border-primary/20 neon-glow">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              <span className="gradient-text neon-text">Admin</span> Access
            </CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 glass-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm font-medium text-center">
                  {error}
                </motion.div>
              )}

              <Button type="submit" className="w-full" variant="premium" disabled={isLoading}>
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  "Login to Admin Panel"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center text-xs text-muted-foreground">
            <p className="w-full">Protected area. Unauthorized access is prohibited.</p>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="mt-8 text-center z-10">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-8 w-8 relative">
            <Image src="/placeholder.svg?height=32&width=32" alt="ProdByShyrap Logo" fill className="object-contain" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="gradient-text neon-text">ProdBy</span>Shyrap
          </span>
        </div>
      </div>
    </div>
  )
}