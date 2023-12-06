/* eslint-disable no-throw-literal */
import User from "../models/users.model.js";
import { DataSource } from "apollo-datasource";
import { validOperation } from "../utils/validOperation.js";
import { AuthenticationError } from "apollo-server-express";

export class UserAPI extends DataSource {
	constructor() {
		super();
		this.baseUrl = "";
	}

	errorFormat(body, status) {
		throw {
			extensions: {
				response: { body, status },
			},
		};
	}

	async createUser(userData) {
		const user = new User(userData);
		const savedUser = await user.save();
		if (savedUser) {
			const token = await user.generateAuthToken();
			user.tokens = user.tokens
				? [{ token }, ...user.tokens]
				: [{ token }];
			return await user.save();
		}
		throw { error: "Unable to save user" };
	}

	async loginUser(email, password) {
		try {
			const user = await User.authenticateUser(email, password);
			if (!user.id) {
				throw new AuthenticationError("Unauthorized");
			}
			const token = await user.generateAuthToken();
			user.tokens = user.tokens
				? [{ token }, ...user.tokens]
				: [{ token }];
			return await user.save();
		} catch (error) {
			return this.errorFormat(error.message, 401);
		}
	}

	async getUser(id) {
		return await User.findByPk(id);
	}

	async getAllUser() {
		return await User.findAll();
	}

	async updateUser(userId, updateUser) {
		const allowedField = ["username", "email", "isAdmin", "password"];
		const updates = validOperation(allowedField, updateUser);
		const id = Number(userId);
		let user = await User.findByPk(id);
		if (!user) {
			this.errorFormat("Movie not in Database", 404);
		}
		updates.forEach((field) => {
			if (field === "password") {
				let token = user.generateAuthToken();
				user.tokens = user.tokens.concat({ token });
			} else {
				user[field] = updateUser[field];
			}
		});
		return await user.save();
	}

	async deleteUser(userId) {
		const id = Number(userId);
		const user = await User.findByPk(id);
		if (!user) this.errorFormat("user not in Database", 404);
		return await user.destroy();
	}
}
