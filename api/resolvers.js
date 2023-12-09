// Resolver functions are responsible for performing the actions defined in the Schema e.g fetching and updating movies
import {
	createUser,
	getUser,
	updateUser,
	loginUser,
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
		getMovie,
		getMovies,
		seedMovies,
	},

	Mutation: {
		createMovie,
		createUser,
		updateUser,
		loginUser,
		deleteUser,
		updateMovie,
		deleteMovie,
		createReview,
	},
	User: {
		userReviews: getMyReviews,
	},
	Movie: {
		movieReviews: getMovieReviews,
	},
};

export default resolvers;
