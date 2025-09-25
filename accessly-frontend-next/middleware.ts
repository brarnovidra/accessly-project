import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/auth/login', '/auth/register']
const PROTECTED_ROUTES = ['/dashboard']

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const { pathname } = request.nextUrl

  // 1. Redirect "/" berdasarkan login status
  if (pathname === '/') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // 2. Blokir akses ke route terlindungi jika tidak ada accessToken
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // 3. Jika user sudah login, jangan izinkan akses ke login/register lagi
  if (accessToken && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*'],
}
