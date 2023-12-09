import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/mysql.js";

// to delete protect route before sending to client
// const PROTECTED_ATTRIBUTES = ["password", "token"];

class Movie extends Model {
	getMovieTitle() {
		return [this.title];
	}
}

Movie.init(
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		adult: DataTypes.BOOLEAN,
		genre_ids: DataTypes.JSON,
		backdrop_path: DataTypes.STRING(2000),
		tmdb_id: DataTypes.INTEGER,
		original_language: DataTypes.STRING(10),
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		overview: {
			type: DataTypes.STRING(3000),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		poster_path: {
			type: DataTypes.STRING(1000),
			allowNull: false,
		},
		vote_average: {
			type: DataTypes.FLOAT(5, 4),
			defaultValue: 1,
			validate: {
				isFloat: true,
				min: {
					args: 1,
					msg: "Rating must be greater than zero (0)",
				},
				max: {
					args: 10,
					msg: "Rating must be less than six (11)",
				},
			},
		},
		popularity: DataTypes.FLOAT(10, 6),
		release_date: DataTypes.STRING,
		original_title: DataTypes.STRING(500),
		video: DataTypes.BOOLEAN,
		vote_count: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: "Movie",
		// field we don't want to send to the client
		defaultScope: {
			attributes: { exclude: ["password"] },
		},
	}
);

// Create the table if it doesn't exist
Movie.sync();

export default Movie;
