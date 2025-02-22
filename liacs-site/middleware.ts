import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/api/login", "/api/logout", "/", "/logout"];

export async function middleware(req: NextRequest) {
  // Bypass middleware if it's a public path
  if (publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = req.cookies.get("token")?.value;
  if (!token) {
    // No token cookie? Redirect to login
    return NextResponse.redirect(
      new URL(
        `/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`,
        req.url
      )
    );
  }

  
  try {
    const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      // If /api/verify returns 401 or fails, redirect to login
      return NextResponse.redirect(
        new URL(
          `/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`,
          req.url
        )
      );
    }

    // Everything is okay; allow the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware verification error:", error);
    return NextResponse.redirect(
      new URL(
        `/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`,
        req.url
      )
    );
  }
}