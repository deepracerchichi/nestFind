import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Same secret the backend signs accessToken with, so this actually
// authenticates the cookie instead of just decoding whatever's in it.
const accessTokenSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, accessTokenSecret);
      const role = payload.role as string;

      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (pathname.startsWith("/dashboard") && role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.next();
    } catch {
      // Invalid signature or expired - fall through and try a silent
      // refresh below instead of treating this as "logged out" outright.
    }
  }

  // No accessToken, or it just expired - try the refreshToken cookie
  // before giving up, the same way the client's axios interceptor already
  // does for API calls. Without this, any fresh page load (new tab, hard
  // refresh) more than 15 minutes after login looks logged-out even
  // though the 7-day refreshToken session is still perfectly valid.
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refreshToken`, {
    headers: { Cookie: `refreshToken=${refreshToken}` },
  });

  if (!refreshRes.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Hand the browser the new accessToken cookie, then redirect back to the
  // same URL - the retry request carries that fresh cookie and passes the
  // check above normally on the next pass.
  const setCookieHeader = refreshRes.headers.get("set-cookie");
  const redirectResponse = NextResponse.redirect(request.url);
  if (setCookieHeader) {
    redirectResponse.headers.set("set-cookie", setCookieHeader);
  }
  return redirectResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};