import { gql } from "apollo-server-express";

export const typeDefs = gql`
	# Special Object type that defines all of the top-level entry points for queries that clients execute against your server.
	type Query {
		"Get a specific movie from our DB"
		getMovie(id: Int!): MovieResponse
		"Get the lists of all movies in our db"
		getMovies: MoviesResponse
		"Get Movies from TMDB API"
		getDiscoverMovies(pageNumber: Int!): getDiscoverMoviesResponse
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
		createUser(data: UserInput): UserTokenResponse
		"Update the user Data"
		updateUser(id: Int!, updateData: UserUpdateInput): UserResponse
		"Login a new user"
		loginUser(email: String!, password: String!): UserTokenResponse
		"Delete a user by id"
		deleteUser(id: Int!): UserResponse
		"Create a new review for a movie"
		createReview(data: ReviewInput): ReviewResponse
	}

	type getDiscoverMoviesResponse {
		results: [Movie]
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
	type ReviewResponse {
		code: Int!
		success: Boolean!
		message: String!
		review: Review
	}
	type UserTokenResponse {
		code: Int!
		success: Boolean!
		message: String!
		user: User
		token: String
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

	input ReviewInput {
		review: String!
		userId: Int!
		movieId: Int!
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
		movieId: Int!
		adult: Boolean
		backkdrop_path: String
		id: Int
		original_language: String
		original_title: String
		overview: String
		popularity: Float
		poster_path: String
		release_date: String
		title: String
		video: Boolean
		vote_average: Float
		vote_count: Int
		genre_ids: JSON
		movieReviews: [Review]
	}
	# give us means to type json object
	scalar JSON

	# The User Type
	type User {
		id: ID!
		username: String!
		email: String!
		isAdmin: Boolean
		userReviews: [Review]
	}

	type Token {
		token: JSON
	}

	type Review {
		id: Int!
		review: String!
	}
`;
