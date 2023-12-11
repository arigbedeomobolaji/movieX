/* eslint-disable no-constant-condition */
import { useQuery, useReactiveVar } from "@apollo/client";
import MovieCard from "./MovieCard";
import { GET_MOVIES } from "../graphql/queries";
import { moviesVar } from "../graphql/cache";
import { useEffect } from "react";
import SkeletonComponent from "./Skeleton";
import { Alert } from "@mui/material";
import Error from "./Error";
function MovieList() {
	const moviesData = useReactiveVar(moviesVar);
	const { data, loading, error } = useQuery(GET_MOVIES);

	useEffect(() => {
		if (data?.getMovies?.movies) {
			moviesVar(data.getMovies.movies);
			localStorage.setItem(
				"moviesData",
				JSON.stringify(data.getMovies.movies)
			);
		}

		return () => {};
	}, [data]);

	if (loading) {
		return (
			<div className="max-w-7xl mx-3 my-5 lg:mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start md:justify-items-center">
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
				<SkeletonComponent />
			</div>
		);
	}

	if (error) {
		return <Error error={error} />;
	}
	return (
		<div className="flex flex-col pb-5 mb-10">
			{moviesData?.length ? (
				<div className="max-w-7xl mx-3 my-5 lg:mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start md:justify-items-center">
					{moviesData.map((movie) => (
						<MovieCard {...movie} key={movie.id} />
					))}
				</div>
			) : (
				<Alert className="w-2/3 mx-auto" severity="error">
					No Movie Found
				</Alert>
			)}
			<div className="mb-5"></div>
		</div>
	);
}

export default MovieList;
