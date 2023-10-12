import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PayInvoice = () => {
	const router = useRouter();
	const { uuid } = router.query;

	//get the invoice from the backend
	const [invoice, setInvoice] = useState(null);
	useEffect(() => {
		if (uuid) {
			fetch(
				`https://invoicexpress.defralcoding.it/api/fic/createXMoneyOrder?uuid=${uuid}`
			)
				//redirect to returned url
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					window.location.href = data.link;
				});
		}
	}, [uuid]);

	return (
		<div>
			<h1>Invoice UUID: {uuid}</h1>
			<h1>Generating your crypto payment, please wait...</h1>
		</div>
	);
};

export default PayInvoice;
