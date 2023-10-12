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
	getInvoice as getInvoiceFromFic,
} from "src/utils/fic";
import { createXMoneyOrder } from "src/utils/xMoney";
import {
	getCompanies,
	addHandledInvoice,
	isInvoiceHandled,
	addInvoice,
	getInvoice,
} from "src/utils/firebase";

export default async function handleNewInvoices(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const uuid = req.query.uuid as string;
	const invoice = await getInvoice(uuid);
	if (!invoice) {
		return res.status(404).send("Invoice not found");
	}
	const companyId = invoice.company;
	const ficInvoiceId = invoice.ficInvoiceId;

	const invoiceObj = await getInvoiceFromFic(companyId, ficInvoiceId);
	const link = await createOrderFromInvoice(companyId, invoiceObj, uuid);

	res.status(200).send(
		JSON.stringify({
			link,
		})
	);
}

async function createOrderFromInvoice(
	companyId: number,
	invoice: IssuedDocument,
	uuid: string
): Promise<{
	redirectUrl: string;
}> {
	const order: Order = {
		amount: {
			total: (invoice.amount_gross ?? 0).toString(),
			currency: "EUR",
		},
		reference: `Fattura n.${invoice.number} del ${invoice.date} <${uuid}>`,
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

	const { redirectUrl } = await createXMoneyOrder(order, customer);
	return redirectUrl;
}
