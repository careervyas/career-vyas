import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Add pathname as header so server components can read it
    const response = NextResponse.next();
    response.headers.set('x-pathname', path);
    return response;
}

export const config = {
    matcher: ['/admin/:path*'],
};
