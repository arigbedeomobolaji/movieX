/* eslint-disable no-unused-vars */
import { InMemoryCache, makeVar } from "@apollo/client";

export const moviesVar = makeVar([]);
export const paginatedMoviesVar = makeVar([]);
export const userVar = makeVar(null);

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				getMovies: {
					// modify before write!
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				getMovie: {
					// modify before write!
					merge(existing = [], incoming) {
						return incoming;
					},
				},
				moviesVar: {
					read() {
						return moviesVar();
					},
				},
				paginatedMoviesVar: {
					read() {
						return paginatedMoviesVar();
					},
				},
			},
		},
	},
});
