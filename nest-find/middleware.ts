import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Same secret the backend signs accessToken with, so this actually
// authenticates the cookie instead of just decoding whatever's in it.
const accessTokenSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const { payload } = await jwtVerify(token, accessTokenSecret);
    const role = payload.role as string;

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard") && role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  } catch {
    // Invalid signature or expired token both land here.
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};