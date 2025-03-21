"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error || !data.session) {
          router.push("/producer/admin-access")
          return
        }
        const user = data.session.user
        if (user?.user_metadata?.role !== 'admin') {
          await supabase.auth.signOut()
          router.push("/producer/admin-access")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Authentication error:", error)
        router.push("/producer/admin-access")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/producer/admin-access")
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user?.user_metadata?.role !== 'admin') {
            await supabase.auth.signOut()
            router.push("/producer/admin-access")
          } else {
            setIsAuthenticated(true)
          }
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return <AdminLayout>{children}</AdminLayout>
}