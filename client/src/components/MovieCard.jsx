/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, CardActionArea, Divider, Rating } from "@mui/material";
import { DELETE_MOVIE } from "../graphql/mutations";
import { useMutation, useReactiveVar } from "@apollo/client";
import { GET_MOVIES } from "../graphql/queries";
import { useState } from "react";
import BasicModal from "./Modal";
import { useNavigate } from "react-router-dom";
import { userVar } from "../graphql/cache";

const tmdbImageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export default function MovieCard({
	id,
	title,
	overview,
	poster_path,
	backdrop_path,
	vote_average,
}) {
	const navigate = useNavigate();
	const [deleteMovie] = useMutation(DELETE_MOVIE, {
		variables: { deleteMovieId: Number(id) },
		optimisticResponse: {
			// What ever I add inside here will be the second parameter in update(cache, TheOptionHere)
			deleteMovie: {
				id,
				__typename: "Movie",
			},
		},
		update(cache) {
			const data = { ...cache.readQuery({ query: GET_MOVIES }) };
			let { movies } = data.movies;
			const movieIndex = movies.findIndex((movie) => id === movie.id);

			movies.splice(movieIndex, 1);
			data.movies.movies = movies;
			cache.writeQuery({ query: GET_MOVIES, data });
		},
		onError: (error) => alert(error.message),
		refetchQueries: [GET_MOVIES],
	});
	const movieData = { title, overview, poster_path, vote_average };
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [performAction, setPerformAction] = useState(false);
	const user = useReactiveVar(userVar);

	return (
		// <Link to={`/movies/${id}`} className="no-underline">
		<Card sx={{ maxWidth: 360 }} className="pt-4 mb-0 flex flex-col">
			<CardActionArea className="mb-0 relative h-[275px]">
				<div className="w-full h-[350px] blur-sm opacity-90">
					<img
						src={`${tmdbImageBaseUrl}/${backdrop_path}`}
						className="w-full h-full object-cover"
					/>
				</div>
				<CardMedia
					className="absolute top-0 h-[350px] object-contain z-10"
					component="img"
					image={`${tmdbImageBaseUrl}/${poster_path}`}
					alt={title + id}
				/>
			</CardActionArea>

			<CardContent className="mt-16">
				<div className="flex flex-col justify-between  relative py-4 h-[250px]">
					<div className="flex-grow  h-2/3">
						<Typography
							gutterBottom
							variant="h6"
							component="div"
							className="text-emerald-700 text-[17px] font-poppings font-bold"
						>
							{title}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{overview.length >= 250
								? overview.substring(1, 250) + "..."
								: overview}
						</Typography>
					</div>

					<div className="h-1/3  mt-4 flex flex-col justify-end">
						<div className="flex items-center justify-between px-3">
							<Rating
								name="read-only"
								value={Math.round(vote_average / 2)}
								readOnly
							/>

							{user?.isAdmin && (
								<MoreVertIcon
									className="font-extrabold font-poppings text-4xl"
									onClick={() =>
										setPerformAction(!performAction)
									}
								/>
							)}
							{performAction && user?.isAdmin && (
								<div className="flex flex-col items-end justify-center absolute bottom-14 right-10   bg-gray-100 rounded-md text-white  pt-5 shadow-lg sapce-y-3">
									<Button
										onClick={deleteMovie}
										className=" text-red-500 font-light font-popping pl-4"
									>
										<DeleteForeverIcon className="" />
										Delete
									</Button>
									<Divider />
									<Button
										onClick={handleOpen}
										className=" text-gray-800 font-light font-poppings m-0 w-full pl-4"
									>
										<EditIcon className="" /> Edit
									</Button>
								</div>
							)}
						</div>
						<Button
							className="text-green-700 justify-start"
							onClick={() =>
								navigate(`/movies/${id}`, {
									state: { from: `/movies/${id}` },
								})
							}
						>
							See More
						</Button>
					</div>
				</div>
			</CardContent>

			<BasicModal
				{...movieData}
				action="Update Movie"
				handleOpen={handleOpen}
				open={open}
				movieId={id}
				handleClose={handleClose}
			/>
		</Card>
		// </Link>
	);
}
