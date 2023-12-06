import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/mysql.js";
import validator from "validator";

// to delete protect route before sending to client
const PROTECTED_ATTRIBUTES = ["password", "token"];

class Movie extends Model {
	getMovieTitle() {
		return [this.title];
	}

	toJSON() {
		// hide protected fields
		let attributes = Object.assign({}, this.get());
		for (let a of PROTECTED_ATTRIBUTES) {
			delete attributes[a];
		}
		return attributes;
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
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		description: {
			type: DataTypes.STRING(400),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		posterUrl: {
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
		rating: {
			type: DataTypes.INTEGER,
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
