import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/mysql.js";

class Review extends Model {
	// Defining association
}

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

// Review.belongsTo(User, { foreignKey: "UserId", as: "user" });
// Review.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });
// Create the table if it doesn't exist
Review.sync();

export default Review;
