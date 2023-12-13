import { gql } from "@apollo/client";

export const CREATE_MOVIE = gql`
	mutation CreateMovie($data: MovieInput!) {
		createMovie(data: $data) {
			movie {
				id
				overview
				poster_path
				title
				vote_average
			}
			message
			success
			code
		}
	}
`;

export const CREATE_REVIEW = gql`
	mutation CreateReview($data: ReviewInput) {
		createReview(data: $data) {
			code
			success
			message
			review {
				id
				review
			}
		}
	}
`;

export const UPDATE_MOVIE = gql`
	mutation UpdateMovie($updateMovieId: Int, $updateData: MovieInput) {
		updateMovie(id: $updateMovieId, updateData: $updateData) {
			movie {
				id
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
				title
				video
				vote_average
				vote_count
				genre_ids
			}
			code
			success
			message
		}
	}
`;

export const DELETE_MOVIE = gql`
	mutation DeleteMovie($deleteMovieId: ID!) {
		deleteMovie(id: $deleteMovieId) {
			code
			success
			message
			movie {
				id
				title
			}
		}
	}
`;

/* 

id
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
				title
				video
				vote_average
				vote_count
*/
