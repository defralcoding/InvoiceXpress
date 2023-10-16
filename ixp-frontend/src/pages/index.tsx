import React from "react";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = () => {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10  max-w-5xl items-center justify-between font-mono text-sm lg:flex">
				<p className=" justify-center  from-zinc-200 pb-6 pt-8 backdrop-blur-2xl  dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:p-4">
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
						Bridging Cryptocurrency Payments and Traditional
						Invoicing Processes
					</h1>
					<p className="text-xl text-center mt-4">
						Leveraging the power of xMoney to help businesses
					</p>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center w-full max-w-5xl">
				<p className="text-center">
					Check the&nbsp;
					<Link
						className="underline"
						href="https://github.com/defralcoding/InvoiceXpress"
					>
						GitHub Repository
					</Link>
					&nbsp;for more details
				</p>
			</div>
		</main>
	);
};

export default SuccessPage;
