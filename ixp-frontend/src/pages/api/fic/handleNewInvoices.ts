import { NextApiRequest, NextApiResponse } from "next";
import { Order, Customer } from "@utrustdev/utrust-ts-library";
import {
	OAuth2AuthorizationCodeManager,
	Scope,
	IssuedDocument,
} from "@fattureincloud/fattureincloud-ts-sdk";
import {
	getCompanyInvoices,
	modifyInvoiceWithLink,
	setInvoicePaid,
} from "@/utils/fic";
import { createXMoneyOrder } from "@/utils/xMoney";
import {
	getCompanies,
	addHandledInvoice,
	isInvoiceHandled,
	addInvoice,
} from "@/utils/firebase";

export default async function handleNewInvoices(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const companies = await getCompanies();
	for (const company of companies) {
		const invoices = await getCompanyInvoices(company.id);
		for (const invoice of invoices) {
			await handleInvoice(company.id, invoice);
		}
	}

	res.status(200).send("Invoices handled!");
}

async function handleInvoice(
	companyId: number,
	invoice: IssuedDocument
): Promise<void> {
	if (await isInvoiceHandled(companyId, invoice.id ?? 0)) {
		return;
	}
	console.log("Handling invoice", invoice.id);

	const newUuid = await addInvoice(companyId, invoice.id ?? 0);
	await modifyInvoiceWithLink(
		companyId,
		invoice.id ?? 0,
		`https://invoicexpress.defralcoding.it/payInvoice/${newUuid}`
	);

	await addHandledInvoice(companyId, invoice.id ?? 0);
}
