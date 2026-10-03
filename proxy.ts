import { NextResponse, type NextRequest } from "next/server"
import { faucetOnSubdomain, faucetOrigin } from "@/lib/site"

const faucetHostPrefix = "faucet."

/**
 * faucet.<host> serves the faucet page at its root and sends every other path back to the main site.
 * Once the faucet subdomain is switched on, /faucet on the main site moves there for good.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? ""
  const { pathname, search } = request.nextUrl

  if (host.startsWith(faucetHostPrefix)) {
    if (pathname === "/") return NextResponse.rewrite(new URL(`/faucet${search}`, request.url))
    // Build from the Host header so redirects keep the public hostname.
    const { protocol } = request.nextUrl
    if (pathname === "/faucet") return NextResponse.redirect(`${protocol}//${host}/${search}`, 308)

    const mainHost = host.slice(faucetHostPrefix.length)
    return NextResponse.redirect(`${protocol}//${mainHost}${pathname}${search}`, 308)
  }

  if (faucetOnSubdomain && pathname === "/faucet") {
    return NextResponse.redirect(`${faucetOrigin}/${search}`, 308)
  }
}

export const config = {
  // Pages only: API routes, build output and metadata files pass straight through.
  matcher: ["/((?!api/|_next/|opengraph-image|icon\.svg|favicon\.ico|fonts/).*)"],
}
