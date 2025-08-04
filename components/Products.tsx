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
import { getAllProducts } from "@/app/actions";

interface ProductsProps {
	slug: any;
}

const Products = async ({ slug }: ProductsProps) => {
	// parse query params
	const params = slug?.searchParams;
	const inStock = params?.inStock !== "false"; // Default to true
	const outOfStock = params?.outOfStock === "true"; // Default to false
	const maxPrice = Number(params?.price || 50000); // Set a reasonable default
	const filterBrand = params?.brandId;
	const filterCategory = params?.categoryId;
	const sortBy = params?.sort || undefined;
	const page = Number(params?.page || 1);
	const perPage = 12;

	// fetch all products using the proper action
	const allProducts: Product[] = await getAllProducts();

	// apply local filters - ensure we always have an array
	const productsArray = Array.isArray(allProducts) ? allProducts : [];
	
	// Apply filters
	let filtered = productsArray.filter((p) => {
		// availability filter logic
		const isInStock = p.quantity > 0;
		const shouldShowInStock = inStock;
		const shouldShowOutOfStock = outOfStock;
		
		// If both checkboxes are checked (or both false), show all products
		if ((shouldShowInStock && shouldShowOutOfStock) || (!shouldShowInStock && !shouldShowOutOfStock)) {
			// Show all products
		} else if (shouldShowInStock && !shouldShowOutOfStock) {
			// Show only in-stock products
			if (!isInStock) return false;
		} else if (!shouldShowInStock && shouldShowOutOfStock) {
			// Show only out-of-stock products  
			if (isInStock) return false;
		}
		
		// price - filter if a specific price limit is set
		const productPrice = p.price || p.sales_price || 0;
		if (params?.price && productPrice > maxPrice) return false;
		
		// brand - use correct property names
		const productBrandId = p.brandId || p.brand_id;
		if (filterBrand && filterBrand !== "" && productBrandId !== Number(filterBrand)) return false;
		
		// category - use correct property names
		const productCategoryId = p.categoryId || p.category_id;
		if (filterCategory && filterCategory !== "" && productCategoryId !== Number(filterCategory)) return false;
		
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
				paged?.map((product) => (
					<ProductItem key={product.id || product.stock_id} product={product} color="black" />
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
