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
import { useMutation } from "@apollo/client";
import { GET_MOVIES } from "../graphql/queries";
import { useState } from "react";
import BasicModal from "./Modal";
import { Link } from "react-router-dom";

export default function MovieCard({
	id,
	title,
	description,
	posterUrl,
	rating,
}) {
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
	const movieData = { title, description, posterUrl, rating };
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [performAction, setPerformAction] = useState(false);

	return (
		<Card sx={{ maxWidth: 360 }} className="pt-4 mb-0">
			<CardActionArea className="mb-0 h-full">
				<div className="w-full h-[350px] blur-sm opacity-90">
					<img
						src={posterUrl}
						className="w-full h-full object-cover"
					/>
				</div>
				<CardMedia
					className="absolute top-0 h-[350px] object-contain z-10"
					component="img"
					image={posterUrl}
					alt={title + id}
				/>

				<CardContent className="md:h-[275px] relative">
					<div className="flex flex-col justify-between h-full">
						<div>
							<Typography
								gutterBottom
								variant="h6"
								component="div"
								className="text-emerald-700 text-[17px] font-poppings font-bold"
							>
								{title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{description}
							</Typography>
						</div>

						<div className="pt-3 flex items-center justify-between px-3">
							<Rating name="read-only" value={rating} readOnly />

							<MoreVertIcon
								className="font-extrabold font-poppings text-4xl"
								onClick={() => setPerformAction(!performAction)}
							/>
							{performAction && (
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
						<Link to={`/movies/${id}`}>
							<Button>See More</Button>
						</Link>
					</div>
				</CardContent>
			</CardActionArea>

			<BasicModal
				{...movieData}
				action="Update Movie"
				handleOpen={handleOpen}
				open={open}
				movieId={id}
				handleClose={handleClose}
			/>
		</Card>
	);
}
