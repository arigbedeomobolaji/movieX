import { gql } from "apollo-server-express";

export const typeDefs = gql`
	# Special Object type that defines all of the top-level entry points for queries that clients execute against your server.
	type Query {
		movie(id: ID!): MovieResponse
		movies: MoviesResponse
		seedMovies(moviesData: [MovieInput!]!): MoviesResponse
	}

	# Mutation type defines entry points for write Operations => POST, PATCH,PUT,DELETE (create,update&delete)
	type Mutation {
		# Create a new movie in our database
		createMovie(data: MovieInput): MovieResponse
		# Delete a movie from our database
		deleteMovie(id: ID!): MovieResponse
		# Update a movie in our database
		updateMovie(id: Int, updateData: MovieUpdateInput): MovieResponse
	}

	type MovieResponse {
		code: Int!
		success: Boolean!
		message: String!
		movie: Movie
	}

	type MoviesResponse {
		code: Int!
		success: Boolean!
		message: String!
		movies: [Movie]
	}

	input MovieInput {
		title: String!
		description: String!
		posterUrl: String!
		rating: Int!
	}

	input MovieUpdateInput {
		title: String
		description: String
		posterUrl: String
		rating: Int
	}

	# The dat we want the movie object to return to our users.
	type Movie {
		id: ID!
		title: String!
		description: String!
		posterUrl: String!
		rating: Int!
	}
`;
