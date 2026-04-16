import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Check for the better-auth session cookie
  // Note: Depending on environment (HTTP vs HTTPS), it might be "__Secure-better-auth.session_token"
  // For basic middleware checks, it's often sufficient to check either.
  const sessionToken = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token")

  const { pathname } = request.nextUrl

  // Rutas públicas — no requieren sesión
  const isPublicRoute =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname === "/"

  if (!sessionToken && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (sessionToken && (pathname === "/login" || pathname === "/register")) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  const response = NextResponse.next()
  // Forward pathname as header so Server Component layouts can read it
  response.headers.set("x-pathname", pathname)

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
