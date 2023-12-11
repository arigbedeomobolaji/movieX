import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users.model.js";
dotenv.config();

const jwtSecret = process.env.TOKEN_SECRET;

// Middleware function to authenticate the user using JWT
export const authenticateUser = async (token) => {
	try {
		const decodedToken = await jwt.verify(token, jwtSecret);
		if (!decodedToken) {
			return null;
		}
		return decodedToken;
	} catch (error) {
		if (error.message === "jwt expired") {
			const payload = await jwt.verify(token, jwtSecret, {
				ignoreExpiration: true,
			});
			const user = await User.findByPk(payload.id);
			if (!user || !user?.tokens?.length) {
				return null;
			}
			user.tokens = user.tokens.filter(
				(userToken) => token !== userToken.token
			);
			const updatedUser = await user.save();
			if (updatedUser) {
				return null;
			}
		}
		return null;
	}
};
