/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
import { useQuery } from "@apollo/client";
import MovieCard from "./MovieCard";
import { CURSORED_MOVIES } from "../graphql/queries";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@mui/material";
import Error from "./Error";
import Loading from "./Loading";
function PaginatedMovieList() {
	const [movies, setMovies] = useState([]);
	const [cursor, setCursor] = useState(null);
	const [hasNextPage, setHasNextPage] = useState(true);

	const { data, loading, error, fetchMore } = useQuery(CURSORED_MOVIES, {
		variables: { first: 15, after: cursor },
	});

	const observerTarget = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchMore({
						variables: {
							after: data.cursoredMovies.pageInfo.endCursor,
						},
						updateQuery: (prevResult, { fetchMoreResult }) => {
							if (!fetchMoreResult) return prevResult;

							setCursor(
								fetchMoreResult.cursoredMovies.pageInfo
									.endCursor
							);
							setMovies([
								...movies,
								...fetchMoreResult.cursoredMovies.edges,
							]);
							setHasNextPage(
								fetchMoreResult.cursoredMovies.pageInfo
									.hasNextPage
							);
						},
					});
				}
			},
			{
				threshold: 1,
			}
		);
		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [data, fetchMore, movies]);

	if (error) {
		return <Error error={error} />;
	}
	return (
		<div className="flex flex-col pb-5 mb-10 mt-24">
			{movies?.length ? (
				<div className="max-w-7xl mx-3 my-5 lg:mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-start md:justify-items-center">
					{movies.map(({ node }) => (
						<MovieCard {...node} key={node.id} />
					))}
				</div>
			) : (
				<Alert className="w-2/3 mx-auto mt-5" severity="error">
					No Movie Found
				</Alert>
			)}
			<div className="mb-5"></div>
			<div ref={observerTarget}></div>

			{loading && <Loading numberOfComponent={5} />}
		</div>
	);
}

export default PaginatedMovieList;
