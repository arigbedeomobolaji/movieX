import { Link, useRouteError } from "react-router-dom";
import Navbar from "./Navbar";
import { TiChevronLeft } from "react-icons/ti";

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);
	return (
		<div className="relative w-full h-full overflow-hidden">
<Navbar />
			<div className="absolute top-24 left-10 bottom-7 overflow-hidden">
			<Link
				to="/"
				className="flex gap-2 items-center text-blue-500 font-poppings text-md p-3 pt-5 no-underline"
			>
				<TiChevronLeft /> Back to Home
			</Link>
			</div>
			<div
			id="error-page"
			className="space-y-18 mt-32  h-full w-full font-poppings flex flex-col items-center justify-center overflow-hidden"
		>
			<h1 className="text-[100px] text-red-700">Oops!</h1>
			<p className="text-[30px] font-bold text-center">
				Sorry, an unexpected error has occurred.
			</p>
			<p className="font-extrabold text-[30px]">
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
		</div>
			
	);
}
