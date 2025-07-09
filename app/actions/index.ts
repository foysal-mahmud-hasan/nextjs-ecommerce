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
	const data = await fetcher("/product");
	return data;
}

export async function getProductDetails(id: string) {
	const data = await fetcher(`/product/${id}`);

	return data;
}

export async function getAllCategories() {
	const { license, activeKey } = (await auth()) as Session;
	if (!license || !activeKey) return [];
	const vendorData = await setVendor(license, activeKey);
	const categories = vendorData?.categories;
	return categories;
}

export async function getAllBrands() {
	const { license, activeKey } = (await auth()) as Session;
	if (!license || !activeKey) return [];
	const vendorData = await setVendor(license, activeKey);
	const brands = vendorData?.brands;
	return brands;
}
