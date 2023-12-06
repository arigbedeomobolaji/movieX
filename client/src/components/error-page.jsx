import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);
	return (
		<div
			id="error-page"
			className="w-screen h-screen space-y-20 p-5 font-poppings flex flex-col items-center justify-center bg-red-50"
		>
			<h1 className="text-[100px] text-red-700">Oops!</h1>
			<p className="text-[30px] font-bold text-center">
				Sorry, an unexpected error has occurred.
			</p>
			<p className="font-extrabold text-[30px]">
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	);
}
