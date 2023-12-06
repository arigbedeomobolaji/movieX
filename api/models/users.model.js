/* eslint-disable no-throw-literal */
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/mysql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticationError } from "apollo-server-express";

dotenv.config();

const secret = process.env.TOKEN_SECRET;

class User extends Model {
	static async authenticateUser(email, password) {
		try {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				throw new AuthenticationError("Unauthorized");
			}
			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) {
				throw new AuthenticationError("Unauthorized.");
			}
			return user;
		} catch (error) {
			return error;
		}
	}
	async generateAuthToken() {
		const user = this;
		const { id, username, email, isAdmin } = user;
		console.log(id, username, email, isAdmin);
		delete user.password;
		const token = await jwt.sign({ id, username, email, isAdmin }, secret, {
			expiresIn: "1h",
		});
		return token;
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: {
					msg: "Please provide a valid Email",
				},
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		tokens: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "user",
		// field we don't want to send to the client
		// defaultScope: {
		// 	attributes: { exclude: ["password"] },
		// },
	}
);

User.beforeSave(async (user, options) => {
	if (user.changed("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
});

// Create the user table if it doesn't exit
User.sync();

export default User;
