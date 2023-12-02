import Filter from "./components/Filter";
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
import {createBrowserRouter, RouteProvider} from "react-router-dom";

const router = createBrowserRouter([{
	path: "/",
	element:
}])
export default function App() {
	return (
		<>
			{/* Navbar */}
			<Navbar />
			{/* Filter Section */}
			<Filter />
			{/* MovieList Section */}
			<MovieList />
		</>
	);
}
