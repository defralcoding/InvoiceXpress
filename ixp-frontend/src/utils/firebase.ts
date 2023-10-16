import { initializeApp, deleteApp } from "firebase/app";
import {
	getFirestore,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	setDoc,
	collection,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function closeFirebase() {
	deleteApp(app);
}

const companiesColl = collection(db, "companies");
const invoicesColl = collection(db, "invoices");

type Company = {
	id: number;
	handledInvoices: number[];
};

type Invoice = {
	company: number;
	ficInvoiceId: number;
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

export async function addInvoice(
	companyId: number,
	ficInvoiceId: number
): Promise<string> {
	const uuid = uuidv4();
	const invoiceDoc = doc(db, "invoices", uuid);
	await setDoc(invoiceDoc, {
		company: companyId,
		ficInvoiceId: ficInvoiceId,
	});
	return uuid;
}

export async function getInvoice(uuid: string): Promise<Invoice> {
	const docRef = doc(db, "invoices", uuid);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		throw new Error("Invoice not found");
	}

	const data = docSnap.data() as Invoice;
	return data;
}
