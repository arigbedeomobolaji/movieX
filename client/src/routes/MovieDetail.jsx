/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { TiChevronLeft } from "react-icons/ti";
import { GET_MOVIE } from "../graphql/queries";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import Error from "../components/Error";
import { Input } from "@mui/material";
import { userVar } from "../graphql/cache";
import { IoMdSend } from "react-icons/io";
import { CREATE_REVIEW } from "../graphql/mutations";

const tmdbImageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const tmdbAuthorization = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

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

	const [youtubeKey, setYoutubeKey] = useState("");
	const [loading, setLoading] = useState(true);

	const user = useReactiveVar(userVar);
	const extraDetails = [
		"original_language",
		"original_title",
		"popularity",
		"vote_average",
		"vote_count",
	];

	const [createReview] = useMutation(CREATE_REVIEW, {
		update(cache, { data: { createReview } }) {
			const data = {
				...cache.readQuery({
					query: GET_MOVIE,
					variables: { movieId: Number(movieId) },
					fetchPolicy: "cache-only",
				}),
			};
			let movieReviews = [data?.getMovie?.movie?.movieReviews];
			let newMovieReviews = [...movieReviews];
			newMovieReviews = [...newMovieReviews, createReview];
			// movieData.getMovie.movie.movieReviews = [...movieReviews];
			cache.writeQuery({
				query: GET_MOVIE,
				data: {
					...data,
					getMovie: {
						...data.getMovie,
						movie: {
							...data.getMovie.movie,
							movieReviews: newMovieReviews
						}
					}
				},
			});
			setYourReview("");
		},
		refetchQueries: [
			GET_MOVIE,
			{
				variables: { movie: Number(movieId) },
				fetchPolicy: "network-only",
			},
		],
		onError: (error) => alert(error.message),
	});

	function handleCreateReview() {
		createReview({
			variables: {
				data: {
					userId: Number(user.id),
					movieId: Number(currentMovie.id),
					review: yourReview,
				},
			},
			optimisticResponse: {
				createReview: {
					__typename: "Review",
					id: "temp-id",
					review: yourReview,
					createdAt: Date.now(),
					updatedAt: Date.now(),
					movieId: Number(movieId),
					
				},
			},
		});
	}

	useEffect(() => {
		const fetchData = async (tmdb_id) => {
			try {
				// Make a GET request using axios
				const response = await axios.get(
					`https://api.themoviedb.org/3/movie/${tmdb_id}/videos?language=en-US`,
					{
						headers: {
							Authorization: `Bearer ${tmdbAuthorization}`,
							accept: "application/json",
						},
					}
				);
				setYoutubeKey(response.data.results[0].key);
			} catch (error) {
				setPageError(error);
			} finally {
				setLoading(false);
			}
		};

		if (error) {
			setPageLoading(false);
			setPageError(error.message);
		}
		if (data?.getMovie?.movie) {
			setCurrentMovie(data.getMovie.movie);
			if (data.getMovie.movie.youtube_link) {
				setYoutubeKey(data.getMovie.movie.youtube_link);
				setLoading(false);
			} else if (data.getMovie.movie.tmdb_id) {
				fetchData(data.getMovie.movie.tmdb_id);
				setLoading(false);
			}
			setPageLoading(false);
		}
	}, [currentMovie.tmdb_id, data, error, navigate]);

	if (pageLoading) {
		return (
			<div>
				<Skeleton />
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</div>
		);
	}

	if (pageError) {
		return <Error error={pageError} />;
	}
	return (
		<div className="max-w-xl ml-3 md:mx-auto mt-32">
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
				<div
					className={`w-[350px] h-[350px]  sm:w-[500px] md:w-[640px] bg-gray-50 ${
						loading ? "animate-pulse" : "animate-none"
					}`}
				>
					<iframe
						src={
							youtubeKey
								? `https://www.youtube.com/embed/${youtubeKey}`
								: "https://www.youtube.com/embed/lV1OOlGwExM"
						}
						frameBorder="0"
						allowFullScreen
						className="w-full h-full animate-none"
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
				{currentMovie?.movieReviews.map((review) => (
					<div
						key={review.id}
						className={`${
							review.reviewer.id === user.id
								? "bg-emerald-50"
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
									? "border-b-emerald-50"
									: "border-b-gray-50"
							} absolute -left-2 bottom-0`}
						></div>
						<div
							className={`triangle ${
								review.reviewer.id === user.id
									? "border-b-emerald-50"
									: "border-b-gray-50"
							} -right-2 top-0 rotate-180`}
						></div>
					</div>
				))}

				<div className="py-4 flex items-center">
					<Input
						variant="standard"
						className="w-full"
						placeholder="Write your review.."
						value={yourReview}
						onChange={(e) => setYourReview(e.target.value)}
					/>
					<IoMdSend
						onClick={handleCreateReview}
						className="text-purple-500 text-[50px] w-1/12"
					/>
				</div>
			</div>
		</div>
	);
}
