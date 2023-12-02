/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Rating,
	Select,
	TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import validator from "validator";
import Modal from "@mui/material/Modal";
import { useState, useMemo } from "react";
import { CREATE_MOVIE, UPDATE_MOVIE } from "../graphql/mutations";
import { GET_MOVIES } from "../graphql/queries";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 600,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function BasicModal({
	open,
	handleClose,
	title = "",
	description = "",
	posterUrl = "",
	rating = 1,
	action = "Save Movie",
	movieId,
}) {
	const [newMovie, setNewMovie] = useState({
		title: title,
		description: description,
		posterUrl: posterUrl,
		rating: rating,
	});
	const [createMovie] = useMutation(CREATE_MOVIE, {
		update(cache, { data: { createMovie } }) {
			const data = { ...cache.readQuery({ query: GET_MOVIES }) };
			let { movies } = data.movies;
			data.movies.movies = [...movies, createMovie];
			cache.writeQuery({ query: GET_MOVIES, data });
			setNewMovie(memoizedNewMovieInitialState);
			handleClose();
		},
		refetchQueries: [GET_MOVIES],
		onError: (error) => alert(error.message),
	});

	const [updateMovie] = useMutation(UPDATE_MOVIE, {
		variables: {
			updateMovieId: Number(movieId),
			updateData: newMovie,
		},
		optimisticResponse: {
			updateMovie: {
				__typename: "Movie",
				id: movieId,
				...newMovie,
				// data: {

				// },
			},
		},
		update(cache, { data: { updateMovie } }) {
			const data = { ...cache.readQuery({ query: GET_MOVIES }) };
			let { movies } = data.movies;
			const movieIndex = movies.findIndex((movie) => {
				return movieId === movie.id;
			});
			movies.splice(movieIndex, 1, updateMovie);
			data.movies.movies = movies;
			cache.writeQuery({ query: GET_MOVIES, data });
			setNewMovie(memoizedNewMovieInitialState);
			handleClose();
		},
		onError: (error) => alert(error.message),
		refetchQueries: [GET_MOVIES],
	});

	const memoizedNewMovieInitialState = useMemo(() => newMovie, []);
	const canContinue =
		newMovie.title.length > 0 &&
		newMovie.description.length > 0 &&
		validator.isURL(newMovie.posterUrl);
	function handleCreateOrEdit() {
		if (action.toLowerCase() === "update movie") {
			updateMovie();
			return;
		}

		createMovie({
			variables: {
				data: {
					...newMovie,
				},
			},
			optimisticResponse: {
				createMovie: {
					id: "temp-id",
					__typename: "Movie",
					...newMovie,
				},
			},
		});
	}

	function handleStateChange(key, value) {
		setNewMovie((prevState) => ({
			...prevState,
			[key]: value,
		}));
	}

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style} className="flex flex-col gap-3 font-poppings">
					<div className="flex items-center justify-between">
						<h1 className="text-emerald-700 font-bold text-xl">
							Add New Movie
						</h1>
						<CloseIcon
							onClick={() => {
								setNewMovie(memoizedNewMovieInitialState);
								handleClose();
							}}
							className="text-red-600 text-4xl cursor-pointer"
						/>
					</div>

					{/* title, description, posterURL, rating */}
					<form>
						<div className="mb-7">
							<TextField
								id="outlined-basic"
								label="Movie Title"
								variant="outlined"
								value={newMovie.title}
								onChange={(event) =>
									handleStateChange(
										"title",
										event.target.value
									)
								}
								fullWidth
								className="h-11 text-emerald-600"
								color="success"
							/>
						</div>

						<div className="mb-7">
							<TextField
								id="outlined-multiline-static"
								label="description"
								multiline
								rows={4}
								fullWidth
								className="text-emerald-600"
								color="success"
								value={newMovie.description}
								onChange={(event) =>
									handleStateChange(
										"description",
										event.target.value
									)
								}
							/>
						</div>
						<div className="mb-7">
							<TextField
								id="outlined-basic"
								label="Movie Url"
								variant="outlined"
								fullWidth
								className="h-11 text-emerald-600"
								color="success"
								value={newMovie.posterUrl}
								onChange={(event) =>
									handleStateChange(
										"posterUrl",
										event.target.value
									)
								}
							/>
						</div>
						{/* Ratng */}
						<div className="mb-6">
							<FormControl fullWidth className="w-full">
								<InputLabel
									id="select-label"
									className="font-poppings h-full text-emerald-700 "
								>
									Rating
								</InputLabel>
								<Select
									labelId="select-label"
									color="success"
									id="demo-simple-select"
									placeholder="Rating"
									defaultValue={0}
									value={newMovie.rating}
									label="Rating"
									onChange={(event) =>
										handleStateChange(
											"rating",
											event.target.value
										)
									}
									className="h-11 w-full flex outline-none"
								>
									<MenuItem value={1}>
										<Rating
											name="read-only"
											value={1}
											readOnly
										/>
									</MenuItem>
									<MenuItem value={2}>
										<Rating
											name="read-only"
											value={2}
											readOnly
										/>
									</MenuItem>
									<MenuItem value={3}>
										<Rating
											name="read-only"
											value={3}
											readOnly
										/>
									</MenuItem>
									<MenuItem value={4}>
										<Rating
											name="read-only"
											value={4}
											readOnly
										/>
									</MenuItem>
									<MenuItem value={5}>
										<Rating
											name="read-only"
											value={5}
											readOnly
										/>
									</MenuItem>
								</Select>
							</FormControl>
						</div>
						<Button
							onClick={handleCreateOrEdit}
							disabled={!canContinue}
							className="bg-emerald-800 text-emerald-100 w-full py-3 disabled:opacity-50"
						>
							{action}
						</Button>
					</form>
				</Box>
			</Modal>
		</div>
	);
}
