/* eslint-disable no-constant-condition */
import { useQuery, useReactiveVar } from "@apollo/client";
import MovieCard from "./MovieCard";
import { GET_MOVIES } from "../graphql/queries";
import { moviesVar } from "../graphql/cache";
import { useEffect, useState } from "react";
import SkeletonComponent from "./Skeleton";
import { Alert, Snackbar } from "@mui/material";
function MovieList() {
	const moviesData = useReactiveVar(moviesVar);
	const { data, loading, error } = useQuery(GET_MOVIES);
	const [open, setOpen] = useState(true);
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		if (data?.movies?.movies) {
			moviesVar(data.movies.movies);
			localStorage.setItem("moviesData", JSON.stringify(moviesData));
		}

		return () => {};
	}, [data, moviesData]);

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
		return (
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "left" }}
			>
				<Alert
					onClose={handleClose}
					severity="error"
					sx={{ width: "100%" }}
				>
					{error.message}
				</Alert>
			</Snackbar>
		);
	}
	return (
		<div className="flex flex-col pb-5">
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
