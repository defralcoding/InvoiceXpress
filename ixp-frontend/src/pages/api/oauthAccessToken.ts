import { NextApiRequest, NextApiResponse } from "next";

export default async function getOAuthAccessToken(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.send("Hello World!");
}
