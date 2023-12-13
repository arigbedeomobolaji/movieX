import { gql } from "apollo-server-express";

export const typeDefs = gql`
	# Special Object type that defines all of the top-level entry points for queries that clients execute against your server.
	type Query {
		"Get paginated movie cursor"
		cursoredMovies(first: Int, after: String): MovieConnection
		"Get a specific movie from our DB"
		getMovie(id: Int!): MovieResponse
		"Get the lists of all movies in our db"
		getMovies: MoviesResponse
		"Get paginated Movies"
		getPaginatedMovies(
			pageNumber: Int!
			limit: Int!
			offset: Int!
		): PaginatedMoviesResponse
		"Get Movies from TMDB API"
		getDiscoverMovies(pageNumber: Int!): getDiscoverMoviesResponse
		"create bulk movies and save them in the db"
		seedMovies(moviesData: [MovieInput!]!): MoviesResponse
		"Get a specific user by Id"
		getUser(id: Int!): UserResponse
		"Get the current user"
		currentUser: UserResponse
		"An Admin to get all the users"
		getAllUser: UsersResponse
	}
	# Mutation type defines entry points for write Operations => POST, PATCH,PUT,DELETE (create,update&delete)
	type Mutation {
		"Create a new movie in our database"
		createMovie(data: MovieInput!): MovieResponse
		"Delete a movie from our database"
		deleteMovie(id: ID!): MovieResponse
		"Update a movie in our database"
		updateMovie(id: Int, updateData: MovieInput): MovieResponse
		"Create a new User"
		createUser(data: UserInput): UserTokenResponse
		"Update the user Data"
		updateUser(id: Int!, updateData: UserUpdateInput): UserTokenResponse
		"Login a new user"
		loginUser(email: String!, password: String!): UserTokenResponse
		"Logout a user on a particular device"
		logout(id: Int!, token: String!): UserResponse
		"Logout a user on all device"
		logoutAll(id: Int!): UserResponse
		"Delete a user by id"
		deleteUser(id: Int!): UserResponse
		"Create a new review for a movie"
		createReview(data: ReviewInput): ReviewResponse
	}

	type PageInfo {
		hasNextPage: Boolean!
		endCursor: String
	}

	type MovieConnection {
		edges: [MovieEdge]
		pageInfo: PageInfo
	}

	type MovieEdge {
		cursor: String!
		node: Movie!
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

	type PaginatedMoviesResponse {
		code: Int!
		success: Boolean!
		message: String!
		movies: [Movie]
		moviesCount: Int
		page: Int
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

	input MovieInput {
		adult: Boolean
		backdrop_path: String
		original_language: String
		original_title: String
		youtube_link: String
		overview: String
		popularity: Float
		poster_path: String
		release_date: String
		title: String
		video: Boolean
		vote_average: Float
		vote_count: Int
	}

	# The dat we want the movie object to return to our users.
	type Movie {
		id: Int!
		adult: Boolean
		backdrop_path: String
		tmdb_id: Int
		youtube_link: String
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
		reviewer: [Review]
	}

	type Token {
		token: JSON
	}

	type Review {
		id: Int!
		review: String!
		reviewer: User
		movieId: Int!
	}
`;
