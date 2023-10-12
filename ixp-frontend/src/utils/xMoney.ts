import { ApiClient, Order, Customer } from "@utrustdev/utrust-ts-library";

export const createXMoneyOrder = async (
	order: Order,
	customer: Customer
): Promise<{
	redirectUrl: string;
	uuid: string;
}> => {
	const { createOrder } = ApiClient(
		process.env.XMONEY_API_KEY,
		process.env.XMONEY_ENVIRONMENT as any
	);

	const { status, data, errors } = await createOrder(order, customer);
	console.error(errors);
	if (!data) {
		throw new Error("No data");
	}

	return data;
};
