/* eslint-disable no-throw-literal */
import { Sequelize, Op } from "sequelize";
import { Movie } from "../models/index.js";
import { errorFormat } from "../utils/errorFormat.js";
import { validOperation } from "../utils/validOperation.js";
import { DataSource } from "apollo-datasource";

export class MovieAPI extends DataSource {
	constructor() {
		super();
		// initialize any configurations or setup here
		this.baseUrl = "";
	}
	async getPaginatedMovies(pageNumber = 1, offset, limit) {
		const moviesCount = await Movie.count();
		const nextOffset = (pageNumber - 1) * offset;
		let paginatedMovies;
		if (offset * pageNumber > moviesCount) {
			pageNumber = Math.floor(moviesCount / offset);
			paginatedMovies = await Movie.findAll({
				limit,
				offset: offset * (pageNumber - 1),
			});
		} else if (moviesCount > 0 && offset * pageNumber <= moviesCount) {
			paginatedMovies = await Movie.findAll({
				limit,
				offset: nextOffset,
			});
		}
		if (paginatedMovies) {
			return { paginatedMovies, moviesCount, pageNumber };
		}
	}

	async cursoredMovies(first, after) {
		const cursorOptions = after
			? { where: { id: { [Op.gt]: after } } }
			: {};
		console.log(after);
		const movies = await Movie.findAll({
			order: [["id", "ASC"]],
			limit: first,
			...cursorOptions,
		});

		const hasNextPage = movies.length === first;
		const endCursor = hasNextPage
			? movies[movies.length - 1].id.toString()
			: null;

		const edges = movies.map((movie) => ({
			cursor: movie.id.toString(),
			node: movie,
		}));

		return {
			edges,
			pageInfo: {
				hasNextPage,
				endCursor,
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
		const allowedField = [
			"adult",
			"backdrop_path",
			"original_language",
			"original_title",
			"overview",
			"popularity",
			"poster_path",
			"release_date",
			"title",
			"video",
			"vote_average",
			"vote_count",
			"genre_ids",
		];
		const updates = validOperation(allowedField, updateData);
		const id = Number(movieId);
		let movie = await Movie.findByPk(id);
		if (!movie) {
			throw errorFormat("Movie not in Database", 404);
		}
		updates.forEach((field) => {
			movie[field] = updateData[field];
		});
		return await movie.save();
	}

	async deleteMovie(movieId) {
		const movie = await Movie.findByPk(movieId);
		if (!movie) this.errorFormat("Movie not in Database", 404);
		return await movie.destroy();
	}
}
