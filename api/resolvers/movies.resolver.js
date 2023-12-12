import { AuthenticationError } from "apollo-server-express";
import { errorFormat } from "../utils/errorFormat.js";
import { errorResponse } from "../resolvers.js";

export const getMovie = async (_, { id }, { dataSources, user }) => {
	try {
		if (user) {
			const movie = await dataSources.movieAPI.getMovie(id);
			if (movie) {
				return {
					code: 201,
					success: true,
					message: "Movie returned",
					movie,
				};
			} else {
				throw errorFormat("Movie not in Database", 404);
			}
		} else {
			throw new AuthenticationError("Access Unauthorized.");
		}
	} catch (error) {
		if (error.name === "AuthenticationError") {
			return errorResponse(errorFormat(error.message, 401));
		}
		return errorResponse(error);
	}
};

export const cursoredMovies = async (
	_,
	{ first = 5, after },
	{ dataSources }
) => {
	const { edges, pageInfo } = await dataSources.movieAPI.cursoredMovies(
		first,
		after
	);
	return {
		edges,
		pageInfo,
	};
};

export const getMovies = async (_, __, { dataSources }) => {
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
};

export const getPaginatedMovies = async (
	_,
	{ limit, offset, pageNumber },
	{ dataSources }
) => {
	try {
		const { moviesCount, paginatedMovies } =
			await dataSources.movieAPI.getPaginatedMovies(
				pageNumber,
				offset,
				limit
			);
		if (paginatedMovies)
			return {
				code: 200,
				success: true,
				message: "Movies returned",
				movies: paginatedMovies,
				moviesCount,
				page: pageNumber,
			};
	} catch (error) {
		return errorResponse(error);
	}
};

export const seedMovies = async (_, { moviesData }, { dataSources }) => {
	const movies = await dataSources.movieAPI.seedMovies(moviesData);
	return {
		code: 201,
		success: true,
		message: "movies seeding successful",
		movies,
	};
};

export const createMovie = async (_, { data }, { dataSources }) => {
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
};

export const updateMovie = async (_, { id, updateData }, { dataSources }) => {
	try {
		const updatedMovie = await dataSources.movieAPI.updateMovie(
			id,
			updateData
		);
		return {
			code: 201,
			success: true,
			message: "Movie successfully updated.",
			movie: updatedMovie,
		};
	} catch (error) {
		return errorResponse(error);
	}
};

export const deleteMovie = async (_, { id }, { dataSources }) => {
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
};
