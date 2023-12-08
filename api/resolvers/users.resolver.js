import { errorResponse } from "../resolvers.js";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { errorFormat } from "../utils/errorFormat.js";

export async function createUser(_, { data }, { dataSources }) {
	try {
		const { user, token } = await dataSources.userAPI.createUser(data);
		return {
			code: 201,
			success: true,
			message: "User successfully created.",
			user,
			token,
		};
	} catch (error) {
		return errorResponse(error);
	}
}

export async function getUser(_, { id }, { dataSources, user }) {
	try {
		if (user && user.id === id) {
			const me = await dataSources.userAPI.getUser(user.id);
			return {
				code: 200,
				success: true,
				message: "user returned.",
				user: me,
			};
		} else {
			throw new AuthenticationError("Access Unauthorized.");
		}
	} catch (error) {
		if (error.name === "AuthenticationError") {
			return errorResponse(errorFormat(error.message, 401));
		}
		return errorResponse(error);
	}
}

export async function updateUser(_, { id, updateData }, { dataSources, user }) {
	try {
		if (user && user.id === id) {
			const updatedUser = await dataSources.userAPI.updateUser(
				id,
				updateData
			);
			return {
				code: 201,
				success: true,
				message: "User successfully created.",
				user: updatedUser,
			};
		} else {
			throw new ForbiddenError("Unauthorized Access");
		}
	} catch (error) {
		return errorResponse(error);
	}
}

export async function loginUser(_, { email, password }, { dataSources }) {
	try {
		const { user, token } = await dataSources.userAPI.loginUser(
			email,
			password
		);
		return {
			code: 201,
			success: true,
			message: "User successfully created.",
			user,
			token,
		};
	} catch (error) {
		return errorResponse(error);
	}
}

export async function getAllUser(_, __, { dataSources, user }) {
	try {
		if (user && user.isAdmin) {
			const users = await dataSources.userAPI.getAllUser();
			return {
				code: 201,
				success: true,
				message: "All users.",
				users,
			};
		} else {
			throw new AuthenticationError("Only admin can access this route");
		}
	} catch (error) {
		console.log(error.name);
		if (error.name === "AuthenticationError") {
			return errorResponse(errorFormat(error.message, 401));
		}
		return errorResponse(error);
	}
}

export async function deleteUser(_, { id }, { dataSources, user }) {
	try {
		if (user) {
			const deletedUser = await dataSources.userAPI.deleteUser(id);
			console.log({ deletedUser });
			return {
				code: 201,
				success: true,
				message: "User Deleted.",
				user: deletedUser,
			};
		} else {
			throw new AuthenticationError("Only admin can access this route");
		}
	} catch (error) {
		console.log(error.name);
		if (error.name === "AuthenticationError") {
			return errorResponse(errorFormat(error.message, 401));
		}
		return errorResponse(error);
	}
}
