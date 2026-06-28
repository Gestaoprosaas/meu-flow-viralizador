import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token session
  const { data: { user } } = await supabase.auth.getUser()

  const currentPath = request.nextUrl.pathname

  // Protected paths filter
  const isDashboardRoute = currentPath.startsWith('/dashboard')
  const isAdminRoute = currentPath.startsWith('/admin')
  const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(currentPath)

  // Admin protection: only users with role === 'admin' in user_metadata or app_metadata can enter /admin
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const role = user.user_metadata?.role || user.app_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // If user has no active session and tries to access dashboard, redirect to login
  if (isDashboardRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    
    // Save any query parameters like referral code if present
    const refCode = request.nextUrl.searchParams.get('ref')
    if (refCode) {
      loginUrl.searchParams.set('ref', refCode)
    }
    
    return NextResponse.redirect(loginUrl)
  }

  // If user is already authenticated and visits register/login, skip authorization and direct to dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to add public paths here
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
