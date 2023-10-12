import {
	Configuration,
	IssuedDocument,
	IssuedDocumentsApi,
	ModifyIssuedDocumentRequest,
} from "@fattureincloud/fattureincloud-ts-sdk";

const ficApiConfig = new Configuration({
	accessToken: process.env.FIC_DEFRALCODING_API_KEY,
});

export const getCompanyInvoices = async (
	companyId: number
): Promise<IssuedDocument[]> => {
	let apiInstance = new IssuedDocumentsApi(ficApiConfig);
	const response = await apiInstance.listIssuedDocuments(
		companyId,
		"invoice"
	);

	console.log(response.data.data);
	return response.data.data ?? [];
};

export const getInvoice = async (
	companyId: number,
	invoiceId: number
): Promise<IssuedDocument> => {
	let apiInstance = new IssuedDocumentsApi(ficApiConfig);
	const response = await apiInstance.getIssuedDocument(companyId, invoiceId);

	console.log(response.data.data);
	return response.data.data ?? [];
};

export const modifyInvoiceWithLink = async (
	companyId: number,
	invoiceId: number,
	link: string
) => {
	let apiInstance = new IssuedDocumentsApi(ficApiConfig);
	let request: ModifyIssuedDocumentRequest = {
		data: {
			notes: `Pay the invoice with xMoney <a href="${link}" rel="noopener noreferrer" target="_blank">here</a>`,
		},
	};

	const { data } = await apiInstance.modifyIssuedDocument(
		companyId,
		invoiceId,
		request
	);
};

export const setInvoicePaid = async (companyId: number, invoiceId: number) => {
	let apiInstance = new IssuedDocumentsApi(ficApiConfig);
	let request: ModifyIssuedDocumentRequest = {
		data: {
			payments_list: [
				{
					due_date: todayToFormat(),
					paid_date: todayToFormat(),
					status: "paid",
					payment_account: {
						id: 1125386, // TODO get from FIC for each company
					},
				},
			],
		},
		options: {
			fix_payments: true,
		},
	};

	const { data } = await apiInstance.modifyIssuedDocument(
		companyId,
		invoiceId,
		request
	);
};

function todayToFormat() {
	//returns today's date in the format YYYY-MM-DD
	var d = new Date(Date.now());
	var month = "" + (d.getMonth() + 1);
	var day = "" + d.getDate();
	var year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	return [year, month, day].join("-");
}
