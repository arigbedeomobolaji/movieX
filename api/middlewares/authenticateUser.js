import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users.model.js";
import { errorFormat } from "../utils/errorFormat.js";
dotenv.config();

const jwtSecret = process.env.TOKEN_SECRET;

// Middleware function to authenticate the user using JWT
export const authenticateUser = async (token) => {
	try {
		const decodedToken = await jwt.verify(token, jwtSecret);
		if (!decodedToken) {
			throw errorFormat("Access Denied. User not authorized.");
		}
		return decodedToken;
	} catch (error) {
		if (error.message === "jwt expired") {
			const payload = await jwt.verify(token, jwtSecret, {
				ignoreExpiration: true,
			});
			const user = await User.findByPk(payload.id);
			user.tokens = user.tokens.filter(
				(userToken) => token !== userToken.token
			);
			const updatedUser = await user.save();
			if (updatedUser) {
				return undefined;
			}
		}
		throw errorFormat("Authentication failed.", 401);
	}
};
