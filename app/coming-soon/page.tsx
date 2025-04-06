'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ComingSoonPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This page is currently under development</CardDescription>
        </CardHeader>
        <CardContent>
          <p>We're working hard to bring you this feature. Please check back later!</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}