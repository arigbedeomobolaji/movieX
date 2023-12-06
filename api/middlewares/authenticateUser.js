import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users.model.js";
dotenv.config();

const jwtSecret = process.env.TOKEN_SECRET;

// Middleware function to authenticate the user using JWT
export const authenticateUser = async (token) => {
	try {
		if (!token) {
			throw new AuthenticationError(
				"Authentication failed. Token not provided."
			);
		}

		const decodedToken = await jwt.verify(token, jwtSecret);
		if (!decodedToken) {
			throw new ForbiddenError("Access Denied. User not authorized.");
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
		throw new AuthenticationError("Authentication failed. Invalid token.");
	}
};
