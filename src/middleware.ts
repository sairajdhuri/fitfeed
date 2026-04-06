import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check onboarding cookie
  const onboardingComplete = request.cookies.get('onboarding_complete')?.value === 'true'

  // Check auth via Supabase cookie presence (sb-* cookies)
  const hasAuthCookies = request.cookies.getAll().some(c => c.name.startsWith('sb-'))

  // Root path redirect
  if (pathname === '/') {
    if (!hasAuthCookies) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Protect login page — redirect logged-in users away
  if (pathname === '/login' && hasAuthCookies) {
    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Protect onboarding — require auth
  if (pathname === '/onboarding') {
    if (!hasAuthCookies) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protect dashboard — require auth + onboarding
  if (pathname.startsWith('/dashboard')) {
    if (!hasAuthCookies) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/onboarding', '/dashboard/:path*'],
}
