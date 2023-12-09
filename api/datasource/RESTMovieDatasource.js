import { RESTDataSource } from "@apollo/datasource-rest";
import dotenv from "dotenv";
import { Movie } from "../models/index.js";
dotenv.config();

export class TmdbAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = `https://api.themoviedb.org/3/movie/`;
		this.token = process.env.TMDB_ACCESS_TOKEN;
	}
	willSendRequest(_path, request) {
		request.headers["authorization"] = `Bearer ${this.token}`;
	}

	async getDiscoverMovies(pageNumber) {
		const movies = await this.get(
			`popular?language=en-US&page=${pageNumber}`
		);
		if (movies) {
			if (Array.isArray(movies.results)) {
				const data = movies.results.map((movie) => {
					const id = movie.id;
					delete movie.id;
					return {
						...movie,
						tmdb_id: id,
					};
				});
				console.log(data);
				return await Movie.bulkCreate(data);
			}
		}
	}
}
