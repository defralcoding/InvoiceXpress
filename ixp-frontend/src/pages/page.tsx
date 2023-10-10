"use client";
import { useEffect } from "react";
import Image from "next/image";
import { getCompanies } from "src/utils/firebase";

export default function Home() {
	useEffect(() => {
		getCompanies().then((companies) => {
			console.log(companies);
		});
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			Test
		</main>
	);
}
