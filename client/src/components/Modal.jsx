/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import CssBaseline from "@mui/material/CssBaseline";
import {
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Rating,
	Select,
	TextField,
} from "@mui/material";
import { DatePicker } from "antd";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import validator from "validator";
import Modal from "@mui/material/Modal";
import { useState, useMemo } from "react";
import { CREATE_MOVIE, UPDATE_MOVIE } from "../graphql/mutations";
import { GET_MOVIES } from "../graphql/queries";
import dayjs from "dayjs";
import { moviesVar } from "../graphql/cache";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	overflow: "scroll",
	height: "90vh",
	padding: 2,
};

export default function BasicModal({
	open,
	handleClose,
	title = "",
	overview = "",
	poster_path = "",
	vote_average = 1,
	adult = false,
	backdrop_path = "",
	vote_count = 1,
	original_language = "",
	popularity,
	release_date = dayjs("01/01/2015", "DD/MM/YYYY"),
	video = false,
	original_title = "",
	youtube_link = "",
	action = "Save Movie",
	movieId,
}) {
	const [newMovie, setNewMovie] = useState({
		title: title,
		overview: overview,
		poster_path: poster_path,
		vote_average: vote_average,
		vote_count: vote_count,
		adult: adult,
		backdrop_path: backdrop_path,
		youtube_link: youtube_link,
		original_language: original_language,
		popularity: popularity,
		release_date: release_date,
		video: video,
		original_title: original_title,
	});
	const [createMovie] = useMutation(CREATE_MOVIE, {
		variables: {
			data: {
				...newMovie,
				vote_average: newMovie.vote_average * 2,
			},
		},
		optimisticResponse: {
			createMovie: {
				__typename: "Movie",
				id: "temp_id",
				...newMovie,
			},
		},
		update(cache, { data: { createMovie } }) {
			if (!createMovie.success) {
				const data = cache.readQuery({
					query: GET_MOVIES,
				});
				cache.writeQuery({
					query: GET_MOVIES,
					data: {
						getMovies: {
							...data.getMovies,
							movies: [...data.getMovies.movies, createMovie],
						},
					},
				});
				setNewMovie(memoizedNewMovieInitialState);
				handleClose();
			}
		},
		refetchQueries: [GET_MOVIES],
		onError: (error) => alert(error.message),
	});

	const [updateMovie] = useMutation(UPDATE_MOVIE, {
		variables: {
			updateMovieId: Number(movieId),
			updateData: {
				...newMovie,
				vote_average: newMovie.vote_average * 2,
			},
		},
		optimisticResponse: {
			updateMovie: {
				__typename: "Movie",
				id: movieId,
				...newMovie,
			},
		},
		update(cache, { data: { updateMovie } }) {
			if (!updateMovie.success) {
				const data = { ...cache.readQuery({ query: GET_MOVIES }) };
				let { movies } = data.getMovies;
				const movieIndex = movies.findIndex((movie) => {
					return movieId === movie.id;
				});

				movies.splice(movieIndex, 1, updateMovie);
				data.getMovies.movies = movies;
				handleClose();
				cache.writeQuery({ query: GET_MOVIES, data });
				setNewMovie(memoizedNewMovieInitialState);
				moviesVar(movies);
			}
		},
		onError: (error) => alert(error.message),
		refetchQueries: [GET_MOVIES],
	});

	const memoizedNewMovieInitialState = useMemo(() => newMovie, []);
	const [dateObj, setDateObj] = useState(release_date);
	const canContinue =
		newMovie.title.length > 0 &&
		newMovie.overview.length > 0 &&
		validator.isURL(newMovie.poster_path) &&
		validator.isURL(newMovie.backdrop_path);

	function handleCreateOrEdit() {
		if (action.toLowerCase() === "update movie") {
			updateMovie();
			return;
		}

		createMovie();
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
				<Box
					sx={style}
					className="flex flex-col gap-3 font-poppings w-10/12 md:max-w-[1000px]"
				>
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

					{/* title, overview, posterURL, vote_average */}
					<form>
						<div className="mb-7">
							<TextField
								id="outlined-basic"
								label="Title"
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
								id="outlined-basic"
								label="Original Title"
								variant="outlined"
								value={newMovie.original_title}
								onChange={(event) =>
									handleStateChange(
										"original_title",
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
								label="overview"
								multiline
								rows={4}
								fullWidth
								className="text-emerald-600"
								color="success"
								value={newMovie.overview}
								onChange={(event) =>
									handleStateChange(
										"overview",
										event.target.value
									)
								}
							/>
						</div>
						{/* Poster_path */}
						<div className="mb-7">
							<TextField
								id="outlined-basic"
								label="Poster Path"
								variant="outlined"
								fullWidth
								className="h-11 text-emerald-600"
								color="success"
								value={newMovie.poster_path}
								onChange={(event) =>
									handleStateChange(
										"poster_path",
										event.target.value
									)
								}
							/>
						</div>
						{/* Poster_path */}
						<div className="mb-7">
							<TextField
								id="outlined-basic"
								label="Backdrop Path"
								variant="outlined"
								fullWidth
								className="h-11 text-emerald-600"
								color="success"
								value={newMovie.backdrop_path}
								onChange={(event) =>
									handleStateChange(
										"backdrop_path",
										event.target.value
									)
								}
							/>
						</div>
						{/* Youtube_path */}
						<div className="mb-7">
							<TextField
								id="outlined-basic"
								label="Youtube Trailer Link"
								variant="outlined"
								fullWidth
								className="h-11 text-emerald-600"
								color="success"
								value={newMovie.youtube_link}
								onChange={(event) =>
									handleStateChange(
										"youtube_link",
										event.target.value
									)
								}
							/>
						</div>
						{/* Rating  and vote count*/}
						<div className="flex gap-3 justify-between">
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
										value={newMovie.vote_average}
										label="Rating"
										onChange={(event) =>
											handleStateChange(
												"vote_average",
												eval(event.target.value)
											)
										}
										className="h-12 w-full flex outline-none"
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
							{/* Original Language */}
							<div className="mb-6">
								<FormControl fullWidth className="w-full">
									<InputLabel
										id="select-label"
										className="font-poppings h-full w-full text-emerald-700"
									>
										Original Lang
									</InputLabel>
									<Select
										labelId="select-label"
										color="success"
										id="demo-simple-select"
										placeholder="Original Lang"
										value={newMovie.original_language}
										label="Original Lang"
										onChange={(event) =>
											handleStateChange(
												"original_language",
												event.target.value
											)
										}
										className="h-12 w-44 flex outline-none"
									>
										<MenuItem value="en">English</MenuItem>
										<MenuItem value="es">Spanish</MenuItem>
										<MenuItem value={"fr"}>French</MenuItem>
										<MenuItem value={"cy"}>
											Chinese
										</MenuItem>
										<MenuItem value={"kr"}>Korean</MenuItem>
									</Select>
								</FormControl>
							</div>
						</div>
						{/* Vote Count and Popularity*/}
						<div className="flex gap-3 mb-3 justify-between">
							{/* Vote count */}
							<div className="">
								<TextField
									type="number"
									id="outlined-basic"
									label="Vote count"
									variant="outlined"
									value={newMovie.vote_count}
									onChange={(event) =>
										handleStateChange(
											"vote_count",
											eval(event.target.value)
										)
									}
									fullWidth
									className="text-emerald-600"
									color="success"
								/>
							</div>
							{/* popularity */}
							<div className="">
								<TextField
									type="number"
									id="outlined-basic"
									label="Popularity"
									variant="outlined"
									value={newMovie.popularity}
									onChange={(event) =>
										handleStateChange(
											"popularity",
											eval(event.target.value)
										)
									}
									fullWidth
									className="h-11 text-emerald-600"
									color="success"
								/>
							</div>
						</div>
						{/* Release day */}
						<div>
							<div className="mb-6">
								<FormControl fullWidth className="w-full">
									<FormLabel id="demo-row-radio-buttons-group-label">
										Release date
									</FormLabel>
									<DatePicker
										defaultValue={dayjs(
											"01/01/2015",
											"DD/MM/YYYY"
										)}
										format={"DD/MM/YYYY"}
										getPopupContainer={(triggerNode) => {
											return triggerNode.parentNode;
										}}
										value={dateObj}
										onChange={(date, dateString) => {
											setDateObj(date);
											handleStateChange(
												"release_date",
												dateString
											);
										}}
									/>
								</FormControl>
							</div>
						</div>
						{/* adult and video */}
						<div className="flex gap-2 justify-between">
							{/* Adult */}
							<div className="mb-6">
								<FormControl fullWidth className="w-full">
									<FormLabel id="demo-row-radio-buttons-group-label">
										Adult
									</FormLabel>
									<RadioGroup
										row
										aria-labelledby="demo-row-radio-buttons-group-label"
										name="row-radio-buttons-group"
										value={newMovie.adult}
										onChange={(ev) =>
											handleStateChange(
												"adult",
												eval(ev.target.value)
											)
										}
									>
										<FormControlLabel
											value={true}
											control={<Radio />}
											label="True"
										/>
										<FormControlLabel
											value={false}
											control={<Radio />}
											label="False"
											defaultChecked={false}
										/>
									</RadioGroup>
								</FormControl>
							</div>
							{/* video */}
							<div className="mb-6">
								<FormControl fullWidth className="w-full">
									<FormLabel id="demo-row-radio-buttons-group-label">
										Video
									</FormLabel>
									<RadioGroup
										row
										aria-labelledby="demo-row-radio-buttons-group-label"
										name="row-radio-buttons-group"
										value={newMovie.video}
										onChange={(ev) =>
											handleStateChange(
												"video",
												eval(ev.target.value)
											)
										}
									>
										<FormControlLabel
											value={true}
											control={<Radio />}
											label="True"
										/>
										<FormControlLabel
											value={false}
											control={<Radio />}
											label="False"
											defaultChecked={false}
										/>
									</RadioGroup>
								</FormControl>
							</div>
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
