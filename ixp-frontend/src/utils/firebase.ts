import { initializeApp, deleteApp } from "firebase/app";
import {
	getFirestore,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	collection,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function closeFirebase() {
	deleteApp(app);
}

const companiesColl = collection(db, "companies");

type Company = {
	id: number;
	handledInvoices: number[];
};

function getCompanyDoc(companyId: number) {
	return doc(db, "companies", companyId.toString());
}

export async function getCompany(
	companyId: number
): Promise<Company | undefined> {
	const docRef = getCompanyDoc(companyId);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		return;
	}

	const data = docSnap.data() as Company;
	return data;
}

export async function getCompanies(): Promise<Company[]> {
	const querySnapshot = await getDocs(companiesColl);
	const companies: Company[] = [];
	querySnapshot.forEach((doc) => {
		companies.push(doc.data() as Company);
	});
	return companies;
}

export async function getHandledInvoices(companyId: number): Promise<number[]> {
	const company = await getCompany(companyId);
	return company ? company.handledInvoices : [];
}

export async function isInvoiceHandled(
	companyId: number,
	invoiceId: number
): Promise<boolean> {
	const handledInvoices = await getHandledInvoices(companyId);
	return handledInvoices.includes(invoiceId);
}

export async function addHandledInvoice(companyId: number, invoiceId: number) {
	const company = await getCompany(companyId);
	if (company) {
		const handledInvoices = company.handledInvoices;
		handledInvoices.push(invoiceId);
		const companyDoc = getCompanyDoc(companyId);
		await updateDoc(companyDoc, {
			handledInvoices: handledInvoices,
		});
	}
}