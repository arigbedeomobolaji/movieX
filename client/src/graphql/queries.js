import { gql } from "@apollo/client";

export const GET_MOVIES = gql`
	query Movies {
		getMovies {
			code
			success
			message
			movies {
				id
				title
				description
				posterUrl
				rating
			}
		}
	}
`;

export const GET_CACHED_MOVIES = gql`
	query Movies {
		movies @client {
			code
			success
			message
			movies {
				id
				title
				description
				posterUrl
				rating
			}
		}
	}
`;

export const GET_MOVIE = gql`
	query Movie($movieId: Int!) {
		getMovie(id: $movieId) {
			code
			success
			message
			movie {
				id
				title
				description
				posterUrl
				rating
			}
		}
	}
`;

export const SEED_MOVIES = gql`
	query SeedMovies($moviesData: [MovieInput!]!) {
		seedMovies(moviesData: $moviesData) {
			code
			success
			message
			movies {
				id
				title
				description
				posterUrl
				rating
			}
		}
	}
`;
