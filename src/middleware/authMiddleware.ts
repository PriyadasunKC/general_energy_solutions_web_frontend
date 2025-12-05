// src/middleware.ts (Updated)
import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '@/types/authTypes';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    // Check if the route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );

    // Get tokens from request cookies
    const accessToken = request.cookies.get('ges_access_token')?.value;
    const refreshToken = request.cookies.get('ges_refresh_token')?.value;

    // Allow access to public routes and static assets
    if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // For protected routes, check authentication
    if (isProtectedRoute) {
        if (!accessToken && !refreshToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('message', 'Please sign in to access this page');
            loginUrl.searchParams.set('redirect', pathname);

            return NextResponse.redirect(loginUrl);
        }
    }

    // If user is authenticated and tries to access auth pages, redirect to home
    if ((pathname.startsWith('/login') || pathname.startsWith('/signup')) && accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
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
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
