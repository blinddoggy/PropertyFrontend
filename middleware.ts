import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: any) {
	// const jwt = request.cookies?.get('ProfileJWT');
	const url = request.url;
	// const secret = new TextEncoder().encode(process.env.SECRET) || '';

	// if (!jwt) {
	// 	if (url !== '/login') {
	// 		return NextResponse.redirect(new URL('/login', url));
	// 	} else {
	// 		return NextResponse.next();
	// 	}
	// }
	if (url.startsWith('/login') || url.startsWith('/projects')) {
		return NextResponse.next();
	} else {
		return NextResponse.redirect(new URL('/projects', url));
	}

	// if (url.startsWith('/login')) {
	// 	try {
	// 		await jwtVerify(jwt.value, secret);
	// 		return NextResponse.redirect(new URL('/projects', url));
	// 	} catch (error) {
	// 		return NextResponse.next();
	// 	}
	// }

	// if (url.startsWith('/projects')) {
	// 	try {
	// 		await jwtVerify(jwt.value, secret);
	// 		return NextResponse.next();
	// 	} catch (error) {
	// 		return NextResponse.redirect(new URL('/login', url));
	// 	}
	// }

	// return NextResponse.next();
}

export const config = {
	matcher: ['/'],
};
