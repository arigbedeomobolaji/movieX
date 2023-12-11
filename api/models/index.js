import User from "./users.model.js";
import Movie from "./movies.model.js";
import Review from "./reviews.model.js";

User.hasMany(Review, { as: "reviewer" });
Movie.hasMany(Review, { as: "movieReviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "reviewer" });
Review.belongsTo(Movie, {
	foreignKey: "movieId",
	as: "movieReviews",
});

export { User, Movie, Review };
