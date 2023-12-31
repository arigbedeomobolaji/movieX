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

export async function currentUser(_, __, { dataSources, user }) {
	try {
		if (user) {
			return {
				code: 200,
				success: true,
				message: "user returned.",
				user,
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
			const { token, updatedUser } = await dataSources.userAPI.updateUser(
				id,
				updateData
			);
			return {
				code: 201,
				success: true,
				message: "User successfully created.",
				user: updatedUser,
				token,
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
		if (user && password) {
			return {
				code: 201,
				success: true,
				message: "User successfully created.",
				user,
				token,
			};
		} else {
			throw errorFormat("Bad Request. Please Create account.", 400);
		}
	} catch (error) {
		return errorResponse(error);
	}
}

export async function logout(_, { id, token }, { dataSources }) {
	try {
		const user = await dataSources.userAPI.logout(id, token);
		if (user) {
			return {
				code: 201,
				success: true,
				message: "User token successfully deleted.",
				user,
				token,
			};
		} else {
			throw errorFormat("Bad Request. Please Create account.", 400);
		}
	} catch (error) {
		return errorResponse(error);
	}
}

export async function logoutAll(_, { id }, { dataSources }) {
	try {
		const user = await dataSources.userAPI.logoutAll(id);
		if (user) {
			return {
				code: 201,
				success: true,
				message: "User logged out on all device",
				user,
			};
		} else {
			throw errorFormat("Bad Request. Please Create account.", 400);
		}
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
		if (error.name === "AuthenticationError") {
			return errorResponse(errorFormat(error.message, 401));
		}
		return errorResponse(error);
	}
}
