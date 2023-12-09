import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/mysql.js";

class Review extends Model {}

Review.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		review: {
			type: DataTypes.STRING(400),
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		movieId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Review",
	}
);

// Create the table if it doesn't exist
Review.sync();

export default Review;
