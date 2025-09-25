import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/new"];

  // Check if the current route is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Check for session cookie or token
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      // Redirect to signin if no session
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};