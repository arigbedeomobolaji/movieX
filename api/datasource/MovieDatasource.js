/* eslint-disable no-throw-literal */
import Movie from "../models/movies.model.js";
import { validOperation } from "../utils/validOperation.js";
import { DataSource } from "apollo-datasource";

export class MovieAPI extends DataSource {
	constructor() {
		super();
		// initialize any configurations or setup here
		this.baseUrl = "";
	}

	errorFormat(body, status) {
		throw {
			extensions: {
				response: { body, status },
			},
		};
	}

	async getMovies() {
		const movies = await Movie.findAll();
		return movies;
	}

	async getMovie(id) {
		const movie = await Movie.findByPk(id);
		return movie;
	}

	async seedMovies(movies) {
		if (Array.isArray(movies)) {
			return await Movie.bulkCreate(movies);
		}
	}

	async createMovie(movieData) {
		const movie = new Movie(movieData);
		return await movie.save();
	}

	async updateMovie(movieId, updateData) {
		const allowedField = ["title", "description", "posterUrl", "rating"];
		const updates = validOperation(allowedField, updateData);
		const id = Number(movieId);
		let movie = await Movie.findByPk(id);
		if (!movie) {
			// error.extensions.response.status,
			this.errorFormat("Movie not in Database", 404);
		}
		updates.forEach((field) => {
			movie[field] = updateData[field];
		});
		return await movie.save();
	}

	async deleteMovie(movieId) {
		const id = Number(movieId);
		const movie = await Movie.findByPk(id);
		if (!movie) this.errorFormat("Movie not in Database", 404);
		return await movie.destroy();
	}
}
