import { StockAvailabillity, ProductTabs, SingleProductDynamicFields } from "@/components";
import { getRandomProductImage } from "@/lib/utils";
import { fetcher } from "@/utils/fetcher";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook, FaSquareXTwitter, FaSquarePinterest } from "react-icons/fa6";

interface ImageItem {
	imageID: string;
	productID: string;
	image: string;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
	// sending API request for a single product with a given product slug
	const product: Product = await fetcher(`/product-details?id=${params?.id}`);
	const images = product?.gallery;

	if (!product) {
		notFound();
	}

	return (
		<div className="bg-white">
			<div className="max-w-screen-2xl mx-auto">
				<div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
					<div>
						<Image
							src={
								product?.imagePath
									? `/${product?.imagePath}`
									: getRandomProductImage()
							}
							width={500}
							height={500}
							alt="main image"
							className="w-auto h-auto"
						/>
						<div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
							{images?.map((img) => (
								<Image
									key={img.imageId}
									src={img.imagePath}
									width={100}
									height={100}
									alt="laptop image"
									className="w-auto h-auto"
								/>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
						{/* <SingleProductRating rating={product?.rating} /> */}
						<h1 className="text-3xl">{product?.name}</h1>
						<div className="flex">
							<span className="text-xl font-semibold">${product?.discountPrice}</span>
							<span className="inline-block px-2">{" / "}</span>
							<span className="text-xl font-semibold line-through">
								${product?.price}
							</span>
						</div>
						{/* TODO: here i have to switch back to the original availability */}
						{/* <StockAvailabillity stock={94} inStock={product?.quantity} /> */}
						<StockAvailabillity stock={94} inStock={100} />
						<SingleProductDynamicFields product={product} />
						<div className="flex flex-col gap-y-2 max-[500px]:items-center">
							<p className="text-lg">
								SKU: <span className="ml-1">{product.item_id}</span>
							</p>
							<div className="text-lg flex gap-x-2">
								<span>Share:</span>
								<div className="flex items-center gap-x-1 text-2xl">
									<FaSquareFacebook />
									<FaSquareXTwitter />
									<FaSquarePinterest />
								</div>
							</div>
							<div className="flex gap-x-2">
								<Image
									src="/visa.svg"
									width={50}
									height={50}
									alt="visa icon"
									className="w-auto h-auto"
								/>
								<Image
									src="/mastercard.svg"
									width={50}
									height={50}
									alt="mastercard icon"
									className="h-auto w-auto"
								/>
								<Image
									src="/ae.svg"
									width={50}
									height={50}
									alt="americal express icon"
									className="h-auto w-auto"
								/>
								<Image
									src="/paypal.svg"
									width={50}
									height={50}
									alt="paypal icon"
									className="w-auto h-auto"
								/>
								<Image
									src="/dinersclub.svg"
									width={50}
									height={50}
									alt="diners club icon"
									className="h-auto w-auto"
								/>
								<Image
									src="/discover.svg"
									width={50}
									height={50}
									alt="discover icon"
									className="h-auto w-auto"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="py-16">
					<ProductTabs product={product} />
				</div>
			</div>
		</div>
	);
};

export default SingleProductPage;
