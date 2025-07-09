export default function ProductsSkeleton() {
	return (
		<div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1 animate-pulse">
			<div className="h-48 bg-gray-200 rounded w-full"></div>
			<div className="h-48 bg-gray-200 rounded w-full"></div>
			<div className="h-48 bg-gray-200 rounded w-full"></div>
			<div className="h-48 bg-gray-200 rounded w-full"></div>
			<div className="h-48 bg-gray-200 rounded w-full"></div>
			<div className="h-48 bg-gray-200 rounded w-full"></div>
		</div>
	);
}
