/* eslint-disable no-unused-vars */
import { InMemoryCache, makeVar } from "@apollo/client";

export const moviesVar = makeVar([]);

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				movies: {
					// modify before write!
					merge(existing = [], incoming) {
						return incoming;
					},
				},
			},
		},
	},
});
