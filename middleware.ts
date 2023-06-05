import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: any) {
	const jwt = request.cookies.get('ProfileJWT');
	const url = request.nextUrl.pathname;
	const secret = new TextEncoder().encode(process.env.SECRET);
	if (!secret) NextResponse.redirect(new URL('/notfound.env', request.url));

	if (!url.startsWith('/login') && !jwt) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (request.nextUrl.pathname.startsWith('/login')) {
		if (jwt && secret) {
			try {
				await jwtVerify(jwt.value, secret);
				return NextResponse.redirect(new URL('/projects', request.url));
			} catch (error) {
				return NextResponse.next();
			}
		}
		return NextResponse.next();
	}

	if (request.nextUrl.pathname.startsWith('/projects')) {
		try {
			if (jwt && secret) {
				await jwtVerify(jwt.value, secret);
				return NextResponse.next();
			}
		} catch (error) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		return NextResponse.redirect(new URL('/login', request.url));
	}
}

export const config = {
	matcher: ['/login', '/projects/:path*'],
};
