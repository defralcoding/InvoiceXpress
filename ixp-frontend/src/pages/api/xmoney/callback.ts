import { NextApiRequest, NextApiResponse } from "next";
import { WebhookValidator } from "@utrustdev/utrust-ts-library";
import fs from "fs";
import { getInvoice } from "src/utils/firebase";

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
	const invoiceUuid = reference.split("<")[1].split(">")[0];
	const invoiceDb = await getInvoice(invoiceUuid);
	if (!invoiceDb) {
		return res.status(404).send("Invoice not found");
	}
	const companyId = invoiceDb.company;
	const invoiceId = invoiceDb.ficInvoiceId;

	await setInvoicePaid(companyId, invoiceId);

	res.status(200).send("Done!");
}
