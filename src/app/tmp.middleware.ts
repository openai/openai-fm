import { NextRequest, NextResponse } from "next/server";
/**
 * Middleware that:
 * 1. Generates a one‑time nonce for this request,
 * 2. Builds a strict Content Security Policy (CSP) using that nonce,
 * 3. Attaches the nonce and CSP to both the incoming request and outgoing response,
 * 4. Applies only to “real” page navigations (skips API, static files, prefetches).
 */
export function middleware(request: NextRequest) {
  // 1. Create a unique, Base64‑encoded value for this request
  const nonce = btoa(crypto.randomUUID());

  // 2. Build a strict Content Security Policy (CSP) using that nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  // 3. Replace newline characters and spaces so it can be used in the header
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  // 4. Attach the nonce and CSP to the incoming request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  // 5. Create a new response object with the updated headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 6. Attach the CSP to the outgoing response
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
