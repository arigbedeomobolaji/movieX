// Resolver functions are responsible for performing the actions defined in the Schema e.g fetching and updating movies

function errorResponse(error) {
	return {
		code: error.extensions.response.status,
		success: false,
		message: error.extensions.response.body,
		movie: null,
	};
}

const resolvers = {
	Query: {
		movie: async (_, { id }, { dataSources }) => {
			try {
				const movie = await dataSources.movieAPI.getMovie(id);
				return {
					code: 201,
					success: true,
					message: "Movie returned",
					movie,
				};
			} catch (error) {
				return errorResponse(error);
			}
		},

		movies: async (_, __, { dataSources }) => {
			try {
				const movies = await dataSources.movieAPI.getMovies();
				if (movies)
					return {
						code: 200,
						success: true,
						message: "Movies returned",
						movies,
					};
			} catch (error) {
				return errorResponse(error);
			}
		},

		seedMovies: async (_, { moviesData }, { dataSources }) => {
			const movies = await dataSources.movieAPI.seedMovies(moviesData);
			return {
				code: 201,
				success: true,
				message: "movies seeding successful",
				movies,
			};
		},
	},

	Mutation: {
		createMovie: async (_, { data }, { dataSources }) => {
			try {
				const newMovie = dataSources.movieAPI.createMovie(data);
				return {
					code: 201,
					success: true,
					message: "Movie successfully Created.",
					movie: newMovie,
				};
			} catch (error) {
				return errorResponse(error);
			}
		},

		async updateMovie(_, { id, updateData }, { dataSources }) {
			try {
				console.log({ id, updateData, message: "Now" });
				const updatedMovie = await dataSources.movieAPI.updateMovie(
					id,
					updateData
				);
				console.log(updatedMovie);
				return {
					code: 201,
					success: true,
					message: "Movie successfully updated.",
					movie: updatedMovie,
				};
			} catch (error) {
				console.log({ error });
				return errorResponse(error);
			}
		},

		async deleteMovie(_, { id }, { dataSources }) {
			try {
				const deletedMovie = await dataSources.movieAPI.deleteMovie(id);
				return {
					code: 201,
					success: true,
					message: "Movie successfully Deleted.",
					movie: deletedMovie,
				};
			} catch (error) {
				return errorResponse(error);
			}
		},
	},
};

export default resolvers;
