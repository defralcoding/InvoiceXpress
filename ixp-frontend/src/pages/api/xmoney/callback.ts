import { NextApiRequest, NextApiResponse } from "next";
import { WebhookValidator } from "@utrustdev/utrust-ts-library";
import fs from "fs";

export default async function handleNewInvoices(
	req: NextApiRequest,
	res: NextApiResponse
) {
	fs.writeFileSync("./req.json", JSON.stringify(req.body));

	if (req.method !== "POST") {
		return res.status(405).send("Method not allowed");
	}

	const { validateSignature } = WebhookValidator(process.env.XMONEY_SECRET);
	if (!validateSignature(req.body)) {
		return res.status(400).send("Invalid signature");
	}

	const reference = req.body.resource.reference;
	const invoiceId = reference.split("<")[1].split(">")[0];

	console.log("invoice id is", invoiceId);

	res.status(200).send("Hello World!");
}
