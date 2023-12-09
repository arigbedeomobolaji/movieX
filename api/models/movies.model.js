import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/mysql.js";
import validator from "validator";

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
		movieId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		adult: DataTypes.BOOLEAN,
		genre_ids: DataTypes.JSON,
		backkdrop_path: DataTypes.STRING(2000),
		id: DataTypes.INTEGER,
		original_language: "en",
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
			type: DataTypes.STRING(2000),
			allowNull: false,
			validate: {
				isUrl(value) {
					if (
						!validator.isURL(value, {
							require_host: true,
							require_valid_protocol: true,
						})
					) {
						throw new Error("Only Valid Url are allowed");
					}
				},
			},
		},
		vote_average: {
			type: DataTypes.DECIMAL(5, 4),
			allowNull: false,
			defaultValue: 1,
			validate: {
				isNumeric: true,
				min: {
					args: 1,
					msg: "Rating must be greater than zero (0)",
				},
				max: {
					args: 5,
					msg: "Rating must be less than six (6)",
				},
			},
		},
		popularity: DataTypes.DECIMAL(6, 4),
		release_date: DataTypes.DATEONLY,
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
