import { NextResponse } from 'next/server'

// Auth is handled client-side via Firebase popup. This route is kept for
// compatibility but simply redirects to /chat.
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/chat`)
}
