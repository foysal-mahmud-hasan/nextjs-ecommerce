import {
	BrandMenu,
	CategoryMenu,
	Hero,
	Incentives,
	IntroducingSection,
	Newsletter,
	ProductsSection,
} from "@/components";

export default function Home() {
	return (
		<>
			<Hero />
			<IntroducingSection />
			<CategoryMenu />
			<BrandMenu />
			<ProductsSection />
			<Incentives />
			<Newsletter />
		</>
	);
}
