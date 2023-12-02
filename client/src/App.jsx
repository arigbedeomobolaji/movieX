import Filter from "./components/Filter";
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
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
