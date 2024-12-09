import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;

  // Add auth header to help with session handling
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(
    "x-auth-status",
    isAuthenticated ? "authenticated" : "unauthenticated"
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/api/auth/:path*", "/login"],
};
