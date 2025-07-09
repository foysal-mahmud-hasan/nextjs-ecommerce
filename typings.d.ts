interface Product {
	productId: number;
	product_id?: number;
	itemId: number;
	item_id: string;
	name: string;
	nameBn: string;
	slug: string;
	quantity: number;
	price: number;
	discountPrice: number;
	categoryId: number;
	category: string;
	categoryBn: string;
	brandId: number;
	brand: string;
	brandBn: string;
	discountId: number;
	discount: string;
	discountBn: string;
	discountType: string;
	discountAmount: number;
	promotionId: number;
	promotion: string;
	promotionBn: string;
	tag: string;
	tagBn: string;
	colors: string;
	colorsBn: string;
	country: string;
	shortDescription: string;
	shortDescriptionBn: string;
	unitName: string;
	itemAssurance: string;
	warningLabel: string;
	isFeatureBrand: number;
	isFeatureCategory: number;
	quantityApplicable: number;
	maxQuantity: number;
	imagePath: string;
	gallery: Array<{
		imageId: number;
		imagePath: string;
	}>;
}

interface SingleProductPageProps {
	params: {
		id: number;
	};
}

type ProductInWishlist = {
	id: string;
	title: string;
	price: number;
	image: string;
	slug: string;
	stockAvailabillity: number;
};

interface OtherImages {
	imageID: number;
	productID: number;
	image: string;
}

interface Category {
	id: number;
	category_id: number;
	name: string;
	nameBn: string;
	feature: number;
	featureItem: number;
	appBgcolor: string;
	bgcolor: string;
	imagePath: string;
}

interface Brand {
	id: number;
	brand_id: number;
	name: string;
	nameBn: string;
	feature: number;
	featureItem: number;
	appBgcolor: string;
	bgcolor: string;
	imagePath: string;
}

interface User {
	id: string;
	email: string;
	password: string | null;
	role: string;
}

interface Order {
	id: string;
	adress: string;
	apartment: string;
	company: string;
	dateTime: string;
	email: string;
	lastname: string;
	name: string;
	phone: string;
	postalCode: string;
	status: "processing" | "canceled" | "delivered";
	city: string;
	country: string;
	orderNotice: string?;
	total: number;
}

interface SingleProductBtnProps {
	product: Product;
	quantityCount: number;
}

interface Category {
	id: string;
	name: string;
}

interface WishListItem {
	id: string;
	userId: string;
	productId: string;
	product: Product;
}
