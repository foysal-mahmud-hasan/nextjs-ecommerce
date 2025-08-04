import { auth } from "./auth";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const API_VALUE = process.env.API_VALUE;

export async function fetcher(endpoint: string, options = {}) {
	const session = await auth();

	if (endpoint !== "/splash" && (!session?.license || !session?.activeKey)) {
		throw new Error("No valid session");
	}

	// header with dynamic session data
	// const headers = {
	// 	"Content-Type": "application/json",
	// 	"X-API-KEY": API_KEY || "",
	// 	"X-API-VALUE": API_VALUE || "",
	// 	"X-API-SECRET": session?.activeKey || "",
	// 	...(options as RequestInit).headers,
	// };

	const headers = {
		"Accept": `application/json`,
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": '*',
		"X-API-KEY": API_KEY || "",
		"X-API-VALUE": API_VALUE || "",
		"X-API-SECRET": 1600010771,
		"X-Api-User" : 14,
	};

	// =============== add a 30-second timeout to the fetch request ================
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds

	const config: RequestInit = {
		method: "GET",
		...options,
		headers,
		signal: controller.signal,
	};

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, config);
		clearTimeout(timeout);
		
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		
		const result = await response.json();
		return result;
	} catch (error) {
		// =============== handle fetch abort error ================
		if ((error as Error)?.name === 'AbortError') {
			console.error('Fetch request timed out');
			throw new Error('Fetch request timed out');
		}
		console.error(`Fetch error: ${(error as Error)?.message}`);
		throw error; // Re-throw so the caller can handle it
	}
}
