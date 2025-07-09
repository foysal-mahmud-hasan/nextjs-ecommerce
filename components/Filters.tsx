"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { fetcher } from "@/utils/fetcher";

type Product = { brandId: number; brand: string; categoryId: number; category: string };

type FiltersState = {
	inStock: boolean;
	outOfStock: boolean;
	price: number;
	rating: number;
	brandId: string;
	categoryId: string;
};

const Filters = ({
	allBrands,
	allCategories,
}: {
	allBrands: Brand[];
	allCategories: Category[];
}) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const { page } = usePaginationStore();
	const { sortBy } = useSortStore();

	const [filters, setFilters] = useState<FiltersState>({
		inStock: true,
		outOfStock: true,
		price: 3000,
		rating: 0,
		brandId: "", // '' means ignore
		categoryId: "",
	});

	// derive initial from URL
	useEffect(() => {
		const p = searchParams;
		setFilters({
			inStock: p.get("inStock") === "true",
			outOfStock: p.get("outOfStock") === "true",
			price: Number(p.get("price") || 50000),
			rating: Number(p.get("rating") || 0),
			brandId: p.get("brandId") || "",
			categoryId: p.get("categoryId") || "",
		});
	}, [searchParams]);

	// fetch product list for brand/category options
	useEffect(() => {
		(async () => {
			const all: Product[] = await fetcher("/product-search");
			const uniqueBrands = Array.from(
				new Map(all.map((p) => [p.brandId, p.brand])).entries()
			).map(([id, name]) => ({ id, name }));
			const uniqueCats = Array.from(
				new Map(all.map((p) => [p.categoryId, p.category])).entries()
			).map(([id, name]) => ({ id, name }));
		})();
	}, []);

	// update URL params
	useEffect(() => {
		const params = new URLSearchParams();
		params.set("inStock", filters.inStock.toString());
		params.set("outOfStock", filters.outOfStock.toString());
		params.set("price", filters.price.toString());
		if (filters.brandId) params.set("brandId", filters.brandId);
		if (filters.categoryId) params.set("categoryId", filters.categoryId);
		params.set("sort", sortBy);
		params.set("page", page.toString());
		replace(`${pathname}?${params}`);
	}, [filters, sortBy, page, pathname, replace]);

	return (
		<div>
			<h3 className="text-2xl mb-2">Filters</h3>
			<div className="divider" />
			{/* Category */}
			<h4 className="text-xl mb-2">Category</h4>
			<select
				value={filters.categoryId}
				onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
				className="select w-full"
			>
				<option value="">All Categories</option>
				{allCategories?.map((c) => (
					<option key={c.category_id} value={c.category_id.toString()}>
						{c.name}
					</option>
				))}
			</select>

			<div className="divider" />
			{/* Brand */}
			<h4 className="text-xl mb-2">Brand</h4>
			<select
				value={filters.brandId}
				onChange={(e) => setFilters((f) => ({ ...f, brandId: e.target.value }))}
				className="select w-full"
			>
				<option value="">All Brands</option>
				{allBrands?.map((b) => (
					<option key={b.brand_id} value={b.brand_id.toString()}>
						{b.name}
					</option>
				))}
			</select>

			<div className="divider" />
			{/* Availability */}
			<h4 className="text-xl mb-2">Availability</h4>
			{["inStock", "outOfStock"].map((key) => (
				<div className="form-control" key={key}>
					<label className="cursor-pointer flex items-center">
						<input
							type="checkbox"
							checked={(filters as any)[key]}
							onChange={() => setFilters((f) => ({ ...f, [key]: !(f as any)[key] }))}
							className="checkbox"
						/>
						<span className="label-text text-lg ml-2 text-black">
							{key === "inStock" ? "In stock" : "Out of stock"}
						</span>
					</label>
				</div>
			))}
			<div className="divider" />
			{/* Price */}
			<h4 className="text-xl mb-2">Price (max)</h4>
			<input
				type="range"
				min={0}
				max={100000}
				step={10}
				value={filters.price}
				onChange={(e) => setFilters((f) => ({ ...f, price: Number(e.target.value) }))}
				className="range"
			/>
			<span>{`৳${filters.price}`}</span>
		</div>
	);
};

export default Filters;
