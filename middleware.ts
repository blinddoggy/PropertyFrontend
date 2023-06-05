import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: any) {
	const jwt = request.cookies?.get('ProfileJWT');
	const url = request.url;
	const secret = new TextEncoder().encode(process.env.SECRET);

	if (!secret) return NextResponse.redirect(new URL('/notfound.env', url));

	if (!url.startsWith('/login') && !jwt) {
		return NextResponse.redirect(new URL('/login', url));
	}

	if (url.startsWith('/login')) {
		if (jwt && secret) {
			try {
				await jwtVerify(jwt.value, secret);
				return NextResponse.redirect(new URL('/projects', url));
			} catch (error) {
				return NextResponse.next();
			}
		}
		return NextResponse.next();
	}

	if (url.startsWith('/projects')) {
		try {
			if (jwt && secret) {
				await jwtVerify(jwt.value, secret);
				return NextResponse.next();
			}
		} catch (error) {
			return NextResponse.redirect(new URL('/login', url));
		}
		return NextResponse.redirect(new URL('/login', url));
	}
}

export const config = {
	matcher: ['/login', '/projects/:path*'],
};
