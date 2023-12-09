import Review from "../models/reviews.model.js";
import { DataSource } from "apollo-datasource";
export class ReviewAPI extends DataSource {
	constructor() {
		super();
		this.baseUrl = "";
	}

	async createReview(reviewData) {
		const newReview = new Review(reviewData);
		return await newReview.save();
	}

	async getMyReviews(userId) {
		return await Review.findAll({ where: { userId } });
	}

	async getMovieReviews(movieId) {
		return await Review.findAll({ where: { movieId } });
	}
}
