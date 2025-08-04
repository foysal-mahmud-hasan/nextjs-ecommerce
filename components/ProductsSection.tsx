// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import { getAllProducts } from "@/app/actions";
import CustomButton from "./CustomButton";
import Link from "next/link";

const ProductsSection = async () => {
	const products = await getAllProducts();
	const popularProducts = products && Array.isArray(products) ? products.slice(0, 8) : [];
	return (
		<div className="bg-blue-500 border-t-4 border-white pb-5">
			<div className="max-w-screen-2xl mx-auto pt-20">
				<Heading title="FEATURED PRODUCTS" />
				<div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-4 px-10 gap-y-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
					{popularProducts?.map((product: Product) => (
						<ProductItem key={product.productId || product.id || product.stock_id} product={product} color="white" />
					))}
				</div>
				<div className="flex justify-center">
					<Link href="/shop">
						<CustomButton
							paddingX={4}
							paddingY={2}
							text="VIEW ALL PRODUCTS"
							buttonType="button"
							customWidth="no"
							textSize="sm"
							className="rounded"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProductsSection;
