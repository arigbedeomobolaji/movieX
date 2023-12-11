// Resolver functions are responsible for performing the actions defined in the Schema e.g fetching and updating movies
import {
	createUser,
	getUser,
	currentUser,
	updateUser,
	loginUser,
	logout,
	logoutAll,
	getAllUser,
	deleteUser,
} from "./resolvers/users.resolver.js";
import {
	getMovie,
	getMovies,
	seedMovies,
	createMovie,
	updateMovie,
	deleteMovie,
} from "./resolvers/movies.resolver.js";
import {
	createReview,
	getMovieReviews,
	getMyReviews,
} from "./resolvers/reviews.resolver.js";

export function errorResponse(error) {
	return {
		code: error?.extensions?.response?.status || 500,
		success: false,
		message: error?.extensions?.response?.body || error.message,
		movie: null,
	};
}

const resolvers = {
	Query: {
		getUser,
		getAllUser,
		currentUser,
		getMovie,
		getMovies,
		seedMovies,
		async getDiscoverMovies(_, { pageNumber }, { dataSources }) {
			const movies = await dataSources.tmdbAPI.getDiscoverMovies(
				pageNumber
			);
			if (movies) {
				return { results: movies };
			}
		},
	},

	Mutation: {
		createMovie,
		createUser,
		updateUser,
		loginUser,
		logout,
		logoutAll,
		deleteUser,
		updateMovie,
		deleteMovie,
		createReview,
	},
	User: {
		reviewer: getMyReviews,
	},
	Movie: {
		movieReviews: getMovieReviews,
	},
};

export default resolvers;
