import { gql } from "@apollo/client";

export const GET_MOVIES = gql`
	query GetMovies {
		getMovies {
			code
			success
			message
			movies {
				id
				adult
				backdrop_path
				id
				tmdb_id
				youtube_link
				original_language
				original_title
				overview
				popularity
				poster_path
				release_date
				title
				video
				vote_average
				vote_count
				genre_ids
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
				adult
				backdrop_path
				tmdb_id
				youtube_link
				original_language
				original_title
				overview
				popularity
				poster_path
				release_date
				video
				vote_average
				vote_count
				genre_ids
				movieReviews {
					id
					review
					reviewer {
						id
						username
					}
				}
			}
		}
	}
`;

export const GET_PAGINATED_MOVIES = gql`
	query GetPaginatedMovies($pageNumber: Int!, $limit: Int!, $offset: Int!) {
		getPaginatedMovies(
			pageNumber: $pageNumber
			limit: $limit
			offset: $offset
		) {
			code
			success
			message
			movies {
				id
				poster_path
				release_date
				title
				adult
				backdrop_path
				tmdb_id
				original_language
				original_title
				overview
				popularity
				video
				vote_average
				vote_count
				genre_ids
			}
			moviesCount
			page
		}
	}
`;

export const CURSORED_MOVIES = gql`
	query CursoredMovies($first: Int, $after: String) {
		cursoredMovies(first: $first, after: $after) {
			edges {
				cursor
				node {
					id
					title
					adult
					backdrop_path
					tmdb_id
					original_language
					original_title
					overview
					popularity
					poster_path
					release_date
					video
					vote_average
					vote_count
					genre_ids
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`;
