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
					amount: 1,
					date: "2023-10-10",
					status: "paid",
					payment_account: {
						id: 1,
					},
				},
			],
		},
	};

	/*
	const { data } = await apiInstance.modifyIssuedDocument(
		companyId,
		invoiceId,
		request
	);
    */
};
