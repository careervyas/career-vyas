import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Apply to all /admin routes except /admin/login
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        const adminAuthCookie = request.cookies.get('adminAuth');

        if (!adminAuthCookie || adminAuthCookie.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
