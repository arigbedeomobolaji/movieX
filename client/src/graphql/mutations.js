import { gql } from "@apollo/client";

export const CREATE_MOVIE = gql`
	mutation CreateMovie($data: MovieInput) {
		createMovie(data: $data) {
			code
			success
			message
			movie {
				title
				id
				description
				posterUrl
				rating
			}
		}
	}
`;

export const UPDATE_MOVIE = gql`
	mutation UpdateMovie($updateMovieId: Int, $updateData: MovieUpdateInput) {
		updateMovie(id: $updateMovieId, updateData: $updateData) {
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

export const DELETE_MOVIE = gql`
	mutation DeleteMovie($deleteMovieId: ID!) {
		deleteMovie(id: $deleteMovieId) {
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
