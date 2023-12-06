import { useReactiveVar } from "@apollo/client";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { moviesVar } from "../graphql/cache";

export default function Movie() {
	const { movieId } = useParams();
	const moviesData = useReactiveVar(moviesVar);
	const movie = moviesData.find((movie) => movie.id === movieId);
	return (
		<>
			<MovieCard {...movie} />
		</>
	);
}
