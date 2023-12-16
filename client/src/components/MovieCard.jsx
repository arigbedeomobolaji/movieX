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
import { useEffect, useState } from "react";
import BasicModal from "./Modal";
import { useNavigate } from "react-router-dom";
import { moviesVar, userVar } from "../graphql/cache";

const tmdbImageBaseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export default function MovieCard({
	id,
	backdrop_path,
	overview,
	poster_path,
	title,
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
			let { movies } = data.getMovies;
			const newMovies = [...movies];
			const movieIndex = newMovies.findIndex((movie) => id === movie.id);
			console.log({newMovies, movieIndex})
			newMovies.splice(movieIndex, 1);
			console.log({newMovies, movieIndex: typeof movieIndex})
			// data.getMovies.movies = movies;
			cache.writeQuery({ 
				query: GET_MOVIES, 
				data: {
					...data, 
					getMovies:
					{
				...data.getMovies,
				movies: [...newMovies]
			}} });
		},
		onError: (error) => alert(error.message),
		refetchQueries: [GET_MOVIES],
	});
	const [movieData, setMovieData] = useState(null);

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setMovieData(null);
	};
	const [performAction, setPerformAction] = useState(false);
	const movies = useReactiveVar(moviesVar);
	const user = useReactiveVar(userVar);

	function handleEdit() {
		const movieData2 = movies.find((movie) => movie.id == id);
		if(movieData2) {
			const movie = Object.fromEntries(
				Object.entries(movieData2)
				.filter(([key]) => key !== "release_date")
			);
			console.log(movie)
			setMovieData(movie);

		}
	}

	useEffect(() => {
		if (movieData) {
			handleOpen();
		}
	}, [movieData]);
	if(poster_path?.includes('http') &&  backdrop_path?.includes('http')){
		console.log(poster_path, backdrop_path)
	}

	return (
		// <Link to={`/movies/${id}`} className="no-underline">
		<Card sx={{ maxWidth: 360 }} className="pt-4 mb-0 flex flex-col">
			<CardActionArea className="mb-0 relative h-[275px]">
				<div className="w-full h-[350px] blur-sm opacity-90">
					<img
						src={backdrop_path?.includes("http") ? `${backdrop_path}` : backdrop_path ? `${tmdbImageBaseUrl}/${backdrop_path}` : "https://images.unsplash.com/photo-1633783714421-332b7f929148?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Tm8lMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D"}
						className="w-full h-full object-cover"
					/>
				</div>
				<CardMedia
					className="absolute top-0 h-[350px] object-contain z-10"
					component="img"
					image={poster_path?.includes("http") ? `${poster_path}` : poster_path ? `${tmdbImageBaseUrl}/${poster_path}`: "https://images.unsplash.com/photo-1633783714421-332b7f929148?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Tm8lMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D"}
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
										onClick={handleEdit}
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

			{movieData && (
				<BasicModal
					{...movieData}
					action="Update Movie"
					handleOpen={handleOpen}
					open={open}
					movieId={id}
					handleClose={handleClose}
				/>
			)}
		</Card>
		// </Link>
	);
}
