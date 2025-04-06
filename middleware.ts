import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, CookieOptions } from '@supabase/ssr'

const DISABLED_ROUTES = ['/account', '/profile']
const ADMIN_ROUTES = ['/producer/admin']
const EXCLUDED_PATHS = ['/producer/admin-access']

export async function middleware(request: NextRequest) {
  let res = NextResponse.next()
  const pathname = request.nextUrl.pathname
  
  if (EXCLUDED_PATHS.some(path => pathname === path)) {
    return res
  }
  
  if (DISABLED_ROUTES.some(route => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/coming-soon'
    return NextResponse.redirect(url)
  }

  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    // Create supabase client with improved cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    try {
      const { data } = await supabase.auth.getSession()
      
      // Check if user is authenticated and is an admin
      const isAdmin =
        data.session?.user?.user_metadata?.role === 'admin' ||
        (data.session?.user?.app_metadata?.role === 'admin')
      
      if (!data.session || !isAdmin) {
        console.log("Authentication failed - redirecting to login")
        const url = request.nextUrl.clone()
        url.pathname = '/producer/admin-access'
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Error in middleware:", error)
      const url = request.nextUrl.clone()
      url.pathname = '/producer/admin-access'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/account/:path*',
    '/profile/:path*',
    '/producer/admin/:path*'
  ]
}