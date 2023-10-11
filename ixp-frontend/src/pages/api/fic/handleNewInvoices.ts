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
} from "src/utils/fic";
import { createXMoneyOrder } from "src/utils/xMoney";
import {
	getCompanies,
	addHandledInvoice,
	isInvoiceHandled,
} from "src/utils/firebase";

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

	res.status(200).send("Hello World!");
}

async function handleInvoice(
	companyId: number,
	invoice: IssuedDocument
): Promise<{
	redirectUrl: string;
	uuid: string;
}> {
	if (await isInvoiceHandled(companyId, invoice.id ?? 0)) {
		console.log(invoice.id, "already handled");
		return;
	}
	console.log("handling invoice", invoice.id);

	const order: Order = {
		amount: {
			total: "10", //TODO(invoice.amount_gross ?? 0).toString(),
			currency: "EUR",
		},
		reference: `Fattura n.${invoice.number} del ${invoice.date} <${invoice.id}>`,
		return_urls: {
			return_url: "http://private.defralcoding.it:8000/success",
			callback_url:
				"http://private.defralcoding.it:8000/api/xmoney/callback",
		},
		line_items: [],
	};
	const customer: Customer = {
		email: "aledef0302@gmail.com",
		first_name: invoice.entity?.name ?? "",
		country: "IT",
		address1: invoice.entity?.address_street ?? "",
		city: invoice.entity?.address_city ?? "",
		state: invoice.entity?.address_province ?? "",
		postcode: invoice.entity?.address_postal_code ?? "",
	};

	await setInvoicePaid(companyId, invoice.id ?? 0);

	//const { redirectUrl, uuid } = await createXMoneyOrder(order, customer);

	//await modifyInvoiceWithLink(companyId, invoice.id ?? 0, redirectUrl);
	//await addHandledInvoice(companyId, invoice.id ?? 0);

	return { redirectUrl, uuid };
}
