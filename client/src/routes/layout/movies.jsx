import Filter from "../../components/Filter";
import MovieList from "../../components/MovieList";

export default function Movies() {
	return (
		<>
			{/* Filter Section */}
			<Filter />
			{/* MovieList Section */}
			<MovieList />
		</>
	);
}
