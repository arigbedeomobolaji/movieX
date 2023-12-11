/* eslint-disable no-unused-vars */
import { useQuery, useReactiveVar } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import { TiChevronLeft } from "react-icons/ti";
import { GET_MOVIE } from "../graphql/queries";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import Error from "../components/Error";
import { Input } from "@mui/material";
import { userVar } from "../graphql/cache";

const tmdbImageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export default function MovieDetails() {
	const [yourReview, setYourReview] = useState("");
	const navigate = useNavigate();
	const { movieId } = useParams();
	const [currentMovie, setCurrentMovie] = useState({ title: "" });
	const [pageLoading, setPageLoading] = useState(true);
	const [pageError, setPageError] = useState(null);
	const { data, error } = useQuery(GET_MOVIE, {
		variables: { movieId: Number(movieId) },
		fetchPolicy: "network-only",
	});
	console.log(yourReview);
	const user = useReactiveVar(userVar);
	const extraDetails = [
		"original_language",
		"original_title",
		"popularity",
		"vote_average",
		"vote_count",
	];

	useEffect(() => {
		if (error) {
			setPageLoading(false);
			setPageError(error.message);
		}
		if (data?.getMovie?.movie) {
			setCurrentMovie(data.getMovie.movie);
			setPageLoading(false);
		}
	}, [data, error, navigate]);

	if (pageLoading) {
		return (
			<div>
				<Skeleton />
			</div>
		);
	}

	if (pageError) {
		return <Error error={pageError} />;
	}
	console.log(currentMovie);
	return (
		<div className="max-w-xl ml-3 md:mx-auto">
			<Link
				to="/"
				className="flex gap-2 items-center text-blue-500 font-poppings text-md p-3 pt-5"
			>
				<TiChevronLeft /> Back to Home
			</Link>
			<div className="font-poppings px-4 space-y-5">
				<h2 className="heading-text">
					{currentMovie.title || "No Title"}
				</h2>
				<div className="w-[100px] bg-red-500">
					<iframe
						src={
							currentMovie?.trailer ||
							"https://www.youtube.com/embed/lV1OOlGwExM"
						}
						frameBorder="0"
						allowFullScreen
						className="w-[350px] h-[350px]  sm:w-[500px] md:w-[640px]"
					></iframe>
				</div>
				<div>
					<h1 className="heading-text">Movie Info</h1>
					<p className="text-purple-500 leading-8">
						{currentMovie?.overview}
					</p>
					<div className="space-y-3">
						{extraDetails.map((detail) => (
							<div key={detail}>
								<span className="font-bold pr-2 text-gray-800">
									{detail}
								</span>
								{currentMovie[detail]}
							</div>
						))}
						<div>
							<span className="font-bold pr-2 text-gray-800">
								Original Language:
							</span>
							English
						</div>
						<div>
							<span className="font-bold pr-2 text-gray-800">
								Release Date:
							</span>
							{moment(currentMovie?.release_date).format(
								"MMM Do YY"
							) || moment(Date.now()).format("MMM Do YY")}
						</div>
						<div className="flex flex-col md:flex-row gap-3">
							<img
								src={`${tmdbImageBaseUrl}/${currentMovie?.poster_path}`}
								className="w-[300px] h-[300px] object-contain"
							/>
							<img
								src={`${tmdbImageBaseUrl}/${currentMovie?.backdrop_path}`}
								className="w-[300px] h-[300px] object-contain"
							/>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h1 className="heading-text">Reviews</h1>
				{currentMovie?.movieReviews.map((review) => {
					console.log(typeof review.reviewer.id, typeof user.id);
					return (
						<div
							key={review.id}
							className={`${
								review.reviewer.id === user.id
									? "bg-rose-50"
									: "bg-purple-50"
							} max-w-x  font-poppings text-sm pl-3 p-1 mb-5 relative leading-3`}
						>
							<p className="text-purple-500 text-[15px] font-bold leading-3">
								{review.reviewer.username}
							</p>
							<p>{review.review}</p>
							<div
								className={`triangle ${
									review.reviewer.id === user.id
										? "border-b-rose-50"
										: "border-b-gray-50"
								} absolute -left-2 bottom-0`}
							></div>
							<div
								className={`triangle ${
									review.reviewer.id === user.id
										? "border-b-rose-50"
										: "border-b-gray-50"
								}d -right-2 top-0 rotate-180`}
							></div>
						</div>
					);
				})}

				<div className="py-4">
					<Input
						variant="standard"
						className="w-full"
						placeholder="Write your review.."
						value={yourReview}
						onChange={(e) => setYourReview(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}
