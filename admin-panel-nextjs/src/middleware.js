import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('token');
    const pathname = req.nextUrl.pathname;
    const isApiRoute = pathname.startsWith('/api');

    if (pathname === '/api/auth/login') {
        return NextResponse.next();
    }

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/admin-panel', req.url));
    }

    if (!token && (pathname === '/admin-panel' || isApiRoute)) {
        if (isApiRoute) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } else {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    if (token) {
        try {
            await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET), {
                issuer: 'urn:portal:issuer',
                audience: 'urn:portal:audience',
            });

            return NextResponse.next();
        } catch (error) {
            const response = isApiRoute
                ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
                : NextResponse.redirect(new URL('/login', req.url));

            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin-panel', '/login', '/api/:path*'],
};