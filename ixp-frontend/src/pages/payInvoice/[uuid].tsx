import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PayInvoice = () => {
	const router = useRouter();
	const { uuid } = router.query;

	const [status, setStatus] = useState("pending");
	const [urlToRedirect, setUrlToRedirect] = useState(null);

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
					setUrlToRedirect(data.link);
				});
		}
	}, [uuid]);

	useEffect(() => {
		console.log(urlToRedirect);
		if (urlToRedirect) {
			setStatus("ready");
			setTimeout(() => {
				//window.location.href = urlToRedirect;
			}, 1500);
		}
	}, [urlToRedirect]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
				<p className="fixed left-0 top-0 flex w-full justify-center  from-zinc-200 pb-6 pt-8 backdrop-blur-2xl  dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:p-4">
					<Image
						src="/logo.png"
						alt="InvoiceXpress Logo"
						width={200}
						height={24}
						priority
					/>
				</p>
			</div>

			<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-[#8a65db] after:via-[#845ed6] after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-[#6334d1] after:dark:via-[#6334d1] after:dark:opacity-40 before:lg:h-[360px]">
				<div className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
					<h1 className="text-5xl font-bold text-center">
						{status === "pending" &&
							"Generating your crypto payment, please wait..."}
						{status === "ready" && "Your crypto payment is ready!"}
					</h1>
					{status === "ready" && (
						<p className="text-xl text-center mt-5">
							If your are not redirected automatically in a few
							seconds, click&nbsp;
							<Link className="underline" href={urlToRedirect}>
								here
							</Link>
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center justify-center w-full max-w-5xl"></div>
		</main>
	);
};

export default PayInvoice;

/*
<h1>Invoice UUID: {uuid}</h1>
<h1>Generating your crypto payment, please wait...</h1>*/
