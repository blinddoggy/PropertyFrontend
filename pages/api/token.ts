// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;
const JWT = process.env.PINATA_API_BEARER_JWT;
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { ProfileJWT } = req.cookies;
	if (!ProfileJWT) {
		return res.status(401).json({ error: 'Not logged in' });
	}
	try {
		jwt.verify(ProfileJWT, secret);
		return res.status(200).json({ JWT });
	} catch (error) {
		return res.status(400).json({ error: 'Request error' });
	}
}
