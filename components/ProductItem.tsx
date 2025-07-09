// *********************
// Role of the component: Product item component
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { getRandomProductImage } from "@/lib/utils";
// import ProductItemRating from "./ProductItemRating";

const ProductItem = ({ product, color }: { product: Product; color: string }) => {
	return (
		<div className="flex flex-col items-center w-full">
			<Link className="w-full flex" href={`/product/${product.productId}`}>
				<Image
					src={product.imagePath ? `/${product.imagePath}` : getRandomProductImage()}
					width="0"
					height="0"
					sizes="100vw"
					className="w-full h-[300px] rounded-ss rounded-tr"
					alt={product?.name}
				/>
			</Link>
			<div className="min-h-[100px] h-full w-full flex flex-col justify-between border-slate-100 border">
				<Link
					href={`/product/${product.productId}`}
					className={`w-full block text-xl  font-normal mt-2 uppercase text-center ${
						color === "black" ? "text-black" : "text-white"
					}`}
				>
					{product.name}
				</Link>
				<p
					className={`text-lg font-semibold text-center ${
						color === "black" ? "text-black" : "text-white"
					}`}
				>
					{product.price}TK
				</p>

				{/* <ProductItemRating productRating={product?.rating} /> */}
				<Link
					href={`/product/${product.productId}`}
					className="flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black dark:border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black dark:hover:bg-gray-100 focus:outline-none focus:ring-2"
				>
					<p>View product</p>
				</Link>
			</div>
		</div>
	);
};

export default ProductItem;
