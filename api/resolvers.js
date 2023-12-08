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

export function errorResponse(error) {
	return {
		code: error.extensions.response.status,
		success: false,
		message: error.extensions.response.body,
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
	},
};

export default resolvers;
