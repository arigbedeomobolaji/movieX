import { errorResponse } from "../resolvers.js";
import { errorFormat } from "../utils/errorFormat.js";

export const createReview = async (_, { data }, { dataSources, user }) => {
	try {
		if (user) {
			const review = await dataSources.reviewAPI.createReview(data);
			return {
				code: 201,
				success: true,
				message: "review successfully Added.",
				review,
			};
		} else {
			throw errorFormat("access restricted. Login", 401);
		}
	} catch (error) {
		return errorResponse(errorFormat(error.message, 500));
	}
};

export const getMyReviews = async ({ id }, _, { dataSources, user }) => {
	if (user) {
		return dataSources.reviewAPI.getMyReviews(id);
	}
};

export const getMovieReviews = async ({ id }, _, { dataSources, user }) => {
	if (user) {
		return dataSources.reviewAPI.getMovieReviews(id);
	}
};
