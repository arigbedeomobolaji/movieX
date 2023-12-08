/* eslint-disable no-unused-vars */
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import { TiChevronLeft } from "react-icons/ti";
import { GET_MOVIE } from "../graphql/queries";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import { Alert, Snackbar } from "@mui/material";

export default function MovieDetails() {
	const navigate = useNavigate();
	const { movieId } = useParams();
	const [currentMovie, setCurrentMovie] = useState({ title: "" });
	const [pageLoading, setPageLoading] = useState(true);
	const [pageError, setPageError] = useState(null);
	const { data, error } = useQuery(GET_MOVIE, {
		variables: { movieId: Number(movieId) },
	});
	const [open, setOpen] = useState(true);
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		if (error) {
			console.log(error);
			setPageLoading(false);
			setPageError(error.message);
			var errorTimeout = setTimeout(() => {
				navigate("/");
			}, 1500);
		}
		if (data?.getMovie?.movie) {
			console.log(data.getMovie.movie);
			setCurrentMovie(data.getMovie.movie);
			setPageLoading(false);
		}

		return () => {
			clearTimeout(errorTimeout);
		};
	}, [data, error, navigate]);

	if (pageLoading) {
		return (
			<div>
				<Skeleton />
			</div>
		);
	}

	if (pageError) {
		return (
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "left" }}
			>
				<Alert
					onClose={handleClose}
					severity="error"
					sx={{ width: "100%" }}
				>
					{JSON.stringify(pageError)}
				</Alert>
			</Snackbar>
		);
	}
	return (
		<div className="max-w-lg ml-3 md:ml-24">
			<Link
				to="/"
				className="flex gap-2 items-center text-blue-500 font-poppings text-md p-3 pt-5"
			>
				<TiChevronLeft /> Back to Home
			</Link>
			<div className="font-poppings px-4 space-y-5">
				<h2 className="text-blue-800 text-2xl font-medium border-l-8 border-blue-800 pl-2">
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

				<p className="text-gray-800 leading-8">
					{currentMovie?.description}
				</p>
				<div className="space-y-3">
					<div>
						<span className="font-bold pr-2 text-gray-800">
							Original Language:
						</span>
						English
					</div>
					<div>
						<span className="font-bold pr-2 text-gray-800">
							Producer:
						</span>
						{currentMovie?.producer || "John Melody"}
					</div>
					<div>
						<span className="font-bold pr-2 text-gray-800">
							Release Date:
						</span>
						{moment(currentMovie?.releasedYear).format(
							"MMM Do YY"
						) || moment(Date.now()).format("MMM Do YY")}
					</div>
					<div>
						<span className="font-bold pr-2 text-gray-800">
							Distributor:
						</span>
						Fathom Events
					</div>
					<div>
						<span className="font-bold pr-2 text-gray-800">
							Official Poster:
						</span>
						<img
							src={currentMovie?.posterUrl}
							className="w-[300px] h-[300px] object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
