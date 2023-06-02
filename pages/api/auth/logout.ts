import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { ProfileJWT } = req.cookies;

	if (!ProfileJWT) {
		return res
			.status(401)
			.json({ message: 'You are already not logged in...' });
	} else {
		const serialised = serialize('ProfileJWT', null, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'strict',
			maxAge: 0,
			path: '/',
		});

		res.setHeader('Set-Cookie', serialised);

		return res.status(200).json({ message: 'Logout successful' });
	}
}
