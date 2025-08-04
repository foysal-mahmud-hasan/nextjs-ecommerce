"use server";

import { auth } from "@/utils/auth";
import { fetcher } from "@/utils/fetcher";
import { Session } from "next-auth";

interface SearchParams {
	query?: string;
	category?: string;
	brand?: string;
}

export async function deleteWishItem(id: string) {
	await fetch(`http://localhost:3001/api/wishlist/${id}`, {
		method: "DELETE",
	});
}

export async function setVendor(license: string, activeKey: string) {
	const response = await fetcher("/splash", {
		method: "POST",
		body: JSON.stringify({
			license,
			activeKey,
		}),
	});

	return response;
}

export async function searchProducts(params: SearchParams) {
	const url = new URL("/product-search", process.env.BASE_URL);

	Object.entries(params).forEach(([key, value]) => {
		if (value) url.searchParams.append(key, value);
	});

	const data = await fetcher(url.toString());

	return data;
}

export async function getAllProducts() {
	try {
		const response = await fetcher("/inventory/stock-item");
		
		// The API returns: { message, status, data: [products] }
		// We need to extract the products array from response.data
		if (response && response.data && Array.isArray(response.data)) {
			return response.data;
		} else if (Array.isArray(response)) {
			return response;
		} else {
			console.warn("API returned unexpected data structure:", response);
			return [];
		}
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

export async function getProductDetails(id: string) {
	try {
		const data = await fetcher(`/inventory/product/${id}`);
		return data;
	} catch (error) {
		console.error("Error fetching product details:", error);
		return null;
	}
}

export async function getAllCategories() {
	try {
		const { license, activeKey } = (await auth()) as Session;
		if (!license || !activeKey) return [];
		const vendorData = await setVendor(license, activeKey);
		const categories = vendorData?.categories;
		return categories || [];
	} catch (error) {
		console.warn("Categories endpoint not available, returning empty array");
		return [];
	}
}

export async function getAllBrands() {
	try {
		const { license, activeKey } = (await auth()) as Session;
		if (!license || !activeKey) return [];
		const vendorData = await setVendor(license, activeKey);
		const brands = vendorData?.brands;
		return brands || [];
	} catch (error) {
		console.warn("Brands endpoint not available, returning empty array");
		return [];
	}
}
