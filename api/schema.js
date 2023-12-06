import { gql } from "apollo-server-express";

export const typeDefs = gql`
	# Special Object type that defines all of the top-level entry points for queries that clients execute against your server.
	type Query {
		"Get a specific movie from our DB"
		movie(id: ID!): MovieResponse
		"Get the lists of all movies in our db"
		movies: MoviesResponse
		"create bulk movies and save them in the db"
		seedMovies(moviesData: [MovieInput!]!): MoviesResponse
		"Get a specific user by Id"
		getUser(id: Int!): UserResponse
		"An Admin to get all the users"
		getAllUser: UsersResponse
	}

	# Mutation type defines entry points for write Operations => POST, PATCH,PUT,DELETE (create,update&delete)
	type Mutation {
		"Create a new movie in our database"
		createMovie(data: MovieInput): MovieResponse
		"Delete a movie from our database"
		deleteMovie(id: ID!): MovieResponse
		"Update a movie in our database"
		updateMovie(id: Int, updateData: MovieUpdateInput): MovieResponse
		"Create a new User"
		createUser(data: UserInput): UserResponse
		"Update the user Data"
		updateUser(id: Int!, updateData: UserUpdateInput): UserResponse
		"Login a new user"
		loginUser(email: String!, password: String!): UserResponse
		"Delete a user by id"
		deleteUser(id: Int!): UserResponse
	}

	type MovieResponse {
		code: Int!
		success: Boolean!
		message: String!
		movie: Movie
	}

	type UserResponse {
		code: Int!
		success: Boolean!
		message: String!
		user: User
	}

	type MoviesResponse {
		code: Int!
		success: Boolean!
		message: String!
		movies: [Movie]
	}

	type UsersResponse {
		code: Int!
		success: Boolean!
		message: String!
		users: [User]
	}

	input MovieInput {
		title: String!
		description: String!
		posterUrl: String!
		rating: Int!
	}

	input UserInput {
		username: String!
		email: String!
		password: String!
		isAdmin: Boolean
	}

	input UserUpdateInput {
		username: String
		email: String
		password: String
		isAdmin: Boolean
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

	scalar JSON

	# The User Type
	type User {
		id: ID!
		username: String!
		email: String!
		isAdmin: Boolean
		tokens: [Token]
	}

	type Token {
		token: JSON
	}
`;
