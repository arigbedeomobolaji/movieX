// Resolver functions are responsible for performing the actions defined in the Schema e.g fetching and updating movies
import Movie from "./models/movies.model.js";
import { validOperation } from "./utils/validOperation.js";

const resolvers = {
	Query: {
		async movie(_, { id }) {
			let query = Number(id);
			return await Movie.findByPk(query);
		},
		async movies(_, __) {
			const movies = await Movie.findAll();
			return movies;
		},
	},

	Mutation: {
		async createMovie(parent, { title, description, posterUrl, rating }) {
			const movie = new Movie({ title, posterUrl, description, rating });
			console.log(rating, typeof rating);
			console.log(movie, typeof movie.rating);
			const newMovie = await movie.save();
			if (newMovie) {
				return newMovie;
			}
			return null;
		},
		async updateMovie(parent, args, context) {
			const id = Number(args.id);
			delete args.id;
			const incomingField = Object.keys(args);
			const allowedField = [
				"title",
				"description",
				"posterUrl",
				"rating",
			];
			validOperation(allowedField, incomingField);
			const movie = await Movie.findByPk(id);
			if (!movie) {
				return null;
			}
			incomingField.forEach((arg) => {
				movie[arg] = args[arg];
			});
			const savedUpdatedMovie = movie.save();
			if (savedUpdatedMovie) {
				return savedUpdatedMovie;
			}
			return null;
		},
		async deleteMovie(parent, { id }, context) {
			id = Number(id);
			const movie = await Movie.findByPk(id);
			if (movie) {
				const deletedMovie = await movie.destroy();
				if (deletedMovie) {
					return deletedMovie;
				}
			}

			return null;
		},
	},
};

export default resolvers;
