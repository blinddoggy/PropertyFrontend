import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" });
		return;
	}
	const { username, password } = JSON.parse(req.body);

	const user = {
		rUsername: "robert@propertytoken.io",
		rPassword: "propertytoken.io",
	};

	if (username == user.rUsername && password == user.rPassword) {
		return res.status(200).json({ login: true });
	}
	return res.status(422).json({ login: false });
}
