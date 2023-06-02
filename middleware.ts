import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: any) {
	const jwt = request.cookies.get('ProfileJWT');
	const url = request.nextUrl.pathname;
	if (url.startsWith('/projects') && !jwt) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	const secret = new TextEncoder().encode(process.env.SECRET);

	if (request.nextUrl.pathname.startsWith('/login')) {
		if (jwt) {
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
			await jwtVerify(jwt.value, secret);
			return NextResponse.next();
		} catch (error) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}
}

export const config = {
	matcher: ['/login', '/projects/:path*'],
};
