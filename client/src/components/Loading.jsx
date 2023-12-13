/* eslint-disable react/prop-types */
import SkeletonComponent from "./Skeleton";

export default function Loading({ numberOfComponent }) {
	const num = Array.from(Array(numberOfComponent).keys());
	return (
		<div className="max-w-7xl mx-3 my-5 lg:mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start md:justify-items-center">
			{num.map((num) => (
				<SkeletonComponent key={num} />
			))}
		</div>
	);
}
