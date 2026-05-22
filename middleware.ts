import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth checks are handled client-side by AdminLayout to avoid cookie path mismatches.
// Backend sets access_token as httpOnly cookie with path=/api, which is never sent
// to Next.js frontend routes (/admin/*). Relying on client-side memory token instead.
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
