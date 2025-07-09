// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products slug={slug} />
// Input parameters: { slug }: any
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import { fetcher } from "@/utils/fetcher";

interface ProductsProps {
	slug: any;
}

const Products = async ({ slug }: ProductsProps) => {
	// parse query params
	const params = slug?.searchParams;
	const inStock = params?.inStock === "true";
	const outOfStock = params?.outOfStock === "true";
	const maxPrice = Number(params?.price || 0);
	const filterBrand = params?.brandId;
	const filterCategory = params?.categoryId;
	const sortBy = params?.sort || undefined;
	const page = Number(params?.page || 1);
	const perPage = 12;

	// fetch all products (no server-side brand/category filters)
	const allProducts: Product[] = await fetcher("/product-search");

	// apply local filters
	let filtered = allProducts.filter((p) => {
		// availability
		if (inStock && !outOfStock && p.quantity <= 0) return false;
		if (!inStock && outOfStock && p.quantity > 0) return false;
		// price
		if (maxPrice && p.price > maxPrice) return false;
		// brand
		if (filterBrand && p.brandId !== Number(filterBrand)) return false;
		// category
		if (filterCategory && p.categoryId !== Number(filterCategory)) return false;
		return true;
	});

	// sorting
	if (sortBy === "lowPrice") {
		filtered.sort((a, b) => a.price - b.price);
	} else if (sortBy === "highPrice") {
		filtered.sort((a, b) => b.price - a.price);
	} else if (sortBy === "titleAsc") {
		filtered.sort((a, b) => a.name.localeCompare(b.name));
	} else if (sortBy === "titleDesc") {
		filtered.sort((a, b) => b.name.localeCompare(a.name));
	}

	// pagination
	const start = (page - 1) * perPage;
	const paged = filtered.slice(start, start + perPage);

	return (
		<div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
			{paged.length > 0 ? (
				paged.map((product) => (
					<ProductItem key={product.productId} product={product} color="black" />
				))
			) : (
				<h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
					No products found for specified query
				</h3>
			)}
		</div>
	);
};

export default Products;
