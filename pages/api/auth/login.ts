import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

const secret = process.env.SECRET;

import { NextApiRequest, NextApiResponse } from 'next';

export default async function loginHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests allowed' });
		return;
	}

	const { username, password } = JSON.parse(req.body);
	const { status, message } = validateUser(username, password);

	if (status == 200) {
		const token = sign(
			{
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
				name: 'Robert Swiss',
				username: username,
			},
			secret
		);

		const serialised = serialize('ProfileJWT', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30,
			path: '/',
		});

		res.setHeader('Set-Cookie', serialised);
	}

	return res.status(status).json({ message });
}

const validateUser = (username: String, password: String) => {
	const user = {
		rUsername: 'robert@propertytoken.io',
		rPassword: 'propertytoken.io',
	};
	let status = 422; //user not found
	let message = 'Invalid credentials';
	if (username == user.rUsername && password == user.rPassword) {
		status = 200;
		message = 'Login successful';
	}
	return { status, message };
};
