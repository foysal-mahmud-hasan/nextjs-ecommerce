"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePayment } from "../../hooks/usePayment";
import {
	isValidEmailAddressFormat,
	isValidNameOrLastname,
} from "@/lib/utils";

const CheckoutPage = () => {
	const [checkoutForm, setCheckoutForm] = useState({
		name: "",
		lastname: "",
		phone: "",
		email: "",
		address: "",
		city: "",
		country: "",
		postalCode: "",
		orderNotice: "",
	});
	const { products, total, clearCart } = useProductStore();
	const router = useRouter();
	const { initiatePayment, loading, error } = usePayment();

	const makePurchase = async () => {
		// Validate required fields
		if (
			!checkoutForm.name ||
			!checkoutForm.lastname ||
			!checkoutForm.phone ||
			!checkoutForm.email ||
			!checkoutForm.address ||
			!checkoutForm.city ||
			!checkoutForm.country ||
			!checkoutForm.postalCode
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Validate formats
		if (!isValidNameOrLastname(checkoutForm.name)) {
			toast.error("You entered invalid format for name");
			return;
		}

		if (!isValidNameOrLastname(checkoutForm.lastname)) {
			toast.error("You entered invalid format for lastname");
			return;
		}

		if (!isValidEmailAddressFormat(checkoutForm.email)) {
			toast.error("You entered invalid format for email address");
			return;
		}

		// Validate products exist
		if (products.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		// Create product name for payment
		const productNames = products?.map(p => p.title).join(", ");
		const productName = productNames.length > 100 ? 
			productNames.substring(0, 97) + "..." : 
			productNames;

		// Initiate payment with SSLCommerz
		const paymentData = {
			amount: total,
			productName,
			productCategory: "ecommerce",
			customerName: `${checkoutForm.name} ${checkoutForm.lastname}`,
			customerEmail: checkoutForm.email,
			customerAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.country} - ${checkoutForm.postalCode}`,
			customerPhone: checkoutForm.phone,
		};

		try {
			await initiatePayment(paymentData);
			// If payment is initiated successfully, clear the cart
			// Note: The actual clearing will happen after successful payment
		} catch (error) {
			console.error("Payment initiation failed:", error);
			toast.error("Failed to initiate payment. Please try again.");
		}
	};

	useEffect(() => {
		if (products.length === 0) {
			toast.error("You don't have items in your cart");
			router.push("/cart");
		}
	}, []);

	return (
		<div className="bg-white">
			<SectionTitle title="Checkout" path="Home | Cart | Checkout" />
			
			{/* Error Display */}
			{error && (
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">Payment Error</h3>
								<p className="text-sm text-red-700 mt-1">{error}</p>
							</div>
						</div>
					</div>
				</div>
			)}
			
			{/* Background color split screen for large screens */}
			<div className="hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
			<div className="hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" />

			<main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
				<h1 className="sr-only">Order information</h1>

				<section
					aria-labelledby="summary-heading"
					className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
				>
					<div className="mx-auto max-w-lg lg:max-w-none">
						<h2 id="summary-heading" className="text-lg font-medium text-gray-900">
							Order summary
						</h2>

						<ul
							role="list"
							className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
						>
							{products?.map((product) => (
								<li key={product?.id} className="flex items-start space-x-4 py-6">
									<Image
										src={
											product?.image
												? `/${product?.image}`
												: "/product_placeholder.jpg"
										}
										alt={product?.title}
										width={80}
										height={80}
										className="h-20 w-20 flex-none rounded-md object-cover object-center"
									/>
									<div className="flex-auto space-y-1">
										<h3>{product?.title}</h3>
										<p className="text-gray-500">x{product?.amount}</p>
									</div>
									<p className="flex-none text-base font-medium">
										${product?.price}
									</p>
									<p></p>
								</li>
							))}
						</ul>

						<dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
							<div className="flex items-center justify-between">
								<dt className="text-gray-600">Subtotal</dt>
								<dd>${total}</dd>
							</div>

							<div className="flex items-center justify-between">
								<dt className="text-gray-600">Shipping</dt>
								<dd>$5</dd>
							</div>

							<div className="flex items-center justify-between">
								<dt className="text-gray-600">Taxes</dt>
								<dd>${total / 5}</dd>
							</div>

							<div className="flex items-center justify-between border-t border-gray-200 pt-6">
								<dt className="text-base">Total</dt>
								<dd className="text-base">
									${total === 0 ? 0 : Math.round(total + total / 5 + 5)}
								</dd>
							</div>
						</dl>
					</div>
				</section>

				<form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
					<div className="mx-auto max-w-lg lg:max-w-none">
						<section aria-labelledby="contact-info-heading">
							<h2
								id="contact-info-heading"
								className="text-lg font-medium text-gray-900"
							>
								Contact information
							</h2>

							<div className="mt-6">
								<label
									htmlFor="name-input"
									className="block text-sm font-medium text-gray-700"
								>
									Name *
								</label>
								<div className="mt-1">
									<input
										value={checkoutForm.name}
										onChange={(e) =>
											setCheckoutForm({
												...checkoutForm,
												name: e.target.value,
											})
										}
										type="text"
										id="name-input"
										name="name-input"
										autoComplete="text"
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="mt-6">
								<label
									htmlFor="lastname-input"
									className="block text-sm font-medium text-gray-700"
								>
									Lastname *
								</label>
								<div className="mt-1">
									<input
										value={checkoutForm.lastname}
										onChange={(e) =>
											setCheckoutForm({
												...checkoutForm,
												lastname: e.target.value,
											})
										}
										type="text"
										id="lastname-input"
										name="lastname-input"
										autoComplete="text"
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="mt-6">
								<label
									htmlFor="phone-input"
									className="block text-sm font-medium text-gray-700"
								>
									Phone number *
								</label>
								<div className="mt-1">
									<input
										value={checkoutForm.phone}
										onChange={(e) =>
											setCheckoutForm({
												...checkoutForm,
												phone: e.target.value,
											})
										}
										type="tel"
										id="phone-input"
										name="phone-input"
										autoComplete="text"
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="mt-6">
								<label
									htmlFor="email-address"
									className="block text-sm font-medium text-gray-700"
								>
									Email address *
								</label>
								<div className="mt-1">
									<input
										value={checkoutForm.email}
										onChange={(e) =>
											setCheckoutForm({
												...checkoutForm,
												email: e.target.value,
											})
										}
										type="email"
										id="email-address"
										name="email-address"
										autoComplete="email"
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							</div>
						</section>

						<section aria-labelledby="payment-heading" className="mt-10">
							<h2 id="payment-heading" className="text-lg font-medium text-gray-900">
								Payment Method
							</h2>
							
							<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<div className="flex items-center">
									<svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
									</svg>
									<div>
										<h3 className="text-lg font-medium text-blue-900">Secure Payment with SSLCommerz</h3>
										<p className="text-blue-700 text-sm mt-1">
											You will be redirected to SSLCommerz secure payment gateway to complete your payment. 
											We accept all major credit cards, mobile banking, and online banking.
										</p>
									</div>
								</div>
							</div>
							
							{error && (
								<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
									{error}
								</div>
							)}
						</section>

						<section aria-labelledby="shipping-heading" className="mt-10">
							<h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
								Shipping address
							</h2>

							<div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
								<div className="sm:col-span-3">
									<label
										htmlFor="address"
										className="block text-sm font-medium text-gray-700"
									>
										Address *
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="address"
											name="address"
											autoComplete="street-address"
											className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											value={checkoutForm.address}
											onChange={(e) =>
												setCheckoutForm({
													...checkoutForm,
													address: e.target.value,
												})
											}
											required
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="city"
										className="block text-sm font-medium text-gray-700"
									>
										City *
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="city"
											name="city"
											autoComplete="address-level2"
											className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											value={checkoutForm.city}
											onChange={(e) =>
												setCheckoutForm({
													...checkoutForm,
													city: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="region"
										className="block text-sm font-medium text-gray-700"
									>
										Country
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="region"
											name="region"
											autoComplete="address-level1"
											className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											value={checkoutForm.country}
											onChange={(e) =>
												setCheckoutForm({
													...checkoutForm,
													country: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="postal-code"
										className="block text-sm font-medium text-gray-700"
									>
										Postal code *
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="postal-code"
											name="postal-code"
											autoComplete="postal-code"
											className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											value={checkoutForm.postalCode}
											onChange={(e) =>
												setCheckoutForm({
													...checkoutForm,
													postalCode: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="order-notice"
										className="block text-sm font-medium text-gray-700"
									>
										Order notice
									</label>
									<div className="mt-1">
										<textarea
											className="textarea textarea-bordered textarea-lg w-full"
											id="order-notice"
											name="order-notice"
											autoComplete="order-notice"
											value={checkoutForm.orderNotice}
											onChange={(e) =>
												setCheckoutForm({
													...checkoutForm,
													orderNotice: e.target.value,
												})
											}
										></textarea>
									</div>
								</div>
							</div>
						</section>

						<div className="mt-10 border-t border-gray-200 pt-6 ml-0">
							<button
								type="button"
								onClick={makePurchase}
								disabled={loading}
								className="w-full rounded-md border border-transparent bg-blue-500 px-20 py-2 text-lg font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{loading ? 'Processing...' : `Pay ৳${total} with SSLCommerz`}
							</button>
						</div>
					</div>
				</form>
			</main>
		</div>
	);
};

export default CheckoutPage;
