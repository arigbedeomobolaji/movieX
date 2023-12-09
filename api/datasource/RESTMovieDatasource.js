import { RESTDataSource } from "@apollo/datasource-rest";
import dotenv from "dotenv";
import { Movie } from "../models.js";
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
				console.log({ from: movies.results });
				// return await Movie.bulkCreate(movies.results);
			}
		}
	}
}
