import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

export default async function profileHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { ProfileJWT } = req.cookies;
	if (!ProfileJWT) {
		return res.status(401).json({ error: 'Not logged in' });
	}
	try {
		const { username, name } = jwt.verify(ProfileJWT, secret);
		return res.status(200).json({ username, name });
	} catch (error) {
		return res.status(400).json({ error: 'Request error' });
	}
}
