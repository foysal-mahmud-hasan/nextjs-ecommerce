export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAllBrands, getAllCategories } from "@/app/actions";
import {
	Breadcrumb,
	Filters,
	Pagination,
	Products,
	ProductsSkeleton,
	SortBy,
	StickyBoxContainer,
} from "@/components";
import React, { Suspense } from "react";

// improve readability of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
	if (text.indexOf("-") !== -1) {
		let textArray = text.split("-");

		return textArray.join(" ");
	} else {
		return text;
	}
};

const ShopPage = async (slug: any) => {
	const [allCategories, allBrands] = await Promise.all([getAllCategories(), getAllBrands()]);

	return (
		<div className="text-black bg-white">
			<div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
				<Breadcrumb />
				<div className="parent grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
					<StickyBoxContainer
						bottomOffset={100}
						boundaryElement=".parent"
						hideOnBoundaryHit={false}
					>
						<Filters allBrands={allBrands} allCategories={allCategories} />
					</StickyBoxContainer>
					<div>
						<StickyBoxContainer>
							<div className="flex bg-white justify-between items-center max-lg:flex-col max-lg:gap-y-5">
								<h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
									{slug?.params?.slug && slug?.params?.slug[0]?.length > 0
										? improveCategoryText(slug?.params?.slug[0])
										: "All products"}
								</h2>

								<SortBy />
							</div>
						</StickyBoxContainer>
						<div className="divider"></div>
						<Suspense fallback={<ProductsSkeleton />}>
							<Products slug={slug} />
						</Suspense>
						<Pagination />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShopPage;
