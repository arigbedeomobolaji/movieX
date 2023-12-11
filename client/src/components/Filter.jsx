/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import BasicModal from "./Modal";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Rating,
	Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { moviesVar } from "../graphql/cache";

function Filter() {
	// Modal states
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [filterOption, setFilterOption] = useState({
		title: "",
		rating: 0,
	});

	const noFilterOption = useMemo(() => filterOption, []);

	function handleClear() {
		setFilterOption(noFilterOption);
		moviesVar(JSON.parse(localStorage.getItem("moviesData")));
	}
	function handleSearch() {
		const savedMovies = JSON.parse(localStorage.getItem("moviesData"));
		const rating = Number(filterOption.rating);

		if (!savedMovies) {
			return;
		}

		if (filterOption.title && rating) {
			let filteredData = savedMovies.filter((movie) =>
				movie.title
					.toLowerCase()
					.includes(filterOption.title.toLowerCase())
			);
			filteredData = filteredData.filter(
				(movie) => Math.round(movie.vote_average / 2) === rating
			);
			moviesVar(filteredData);
			return;
		}

		if (filterOption.title) {
			const filteredData = savedMovies.filter((movie) =>
				movie.title
					.toLowerCase()
					.includes(filterOption.title.toLowerCase())
			);
			moviesVar(filteredData);
			return;
		}

		if (rating === 0) {
			moviesVar(savedMovies);
		}

		if (rating) {
			const filteredData = savedMovies.filter(
				(movie) => Math.round(movie.vote_average / 2) === rating
			);
			moviesVar(filteredData);
			return;
		}
	}

	function handleStateChange(key, value) {
		setFilterOption((preValue) => ({
			...preValue,
			[key]: value,
		}));
	}

	useEffect(() => {
		handleSearch();
		return () => {};
	}, [filterOption.title, filterOption.rating]);

	return (
		<>
			<div className="max-w-7xl mx-5 xl:mx-auto my-7">
				<h1 className="mb-2 text-2xl font-bold text-emerald-600 font-poppings tracking-wider">
					Filters
				</h1>
				<div className="flex gap-3 flex-col md:flex-row md:items-center md:justify-between">
					{/* Filter title and rate */}
					<div className="flex flex-wrap justify-start items-center gap-3">
						<div className="relative">
							<input
								placeholder="Search Filter"
								className="border  shadow-lg rounded-md py-3 px-2 w-[280px] focus:w-[300px] outline-none pr-8 text-emerald-900"
								value={filterOption.title}
								onChange={(e) => {
									handleStateChange("title", e.target.value);
								}}
							/>
							<SearchIcon className="text-emerald-600 absolute top-[10px] right-2" />
						</div>
						<div>
							<FormControl
								fullWidth
								className="shadow-lg rounded-2xl flex"
							>
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
									placeholder="Filter Rating"
									value={filterOption.rating}
									label="Rating"
									onChange={(event) =>
										handleStateChange(
											"rating",
											Number(event.target.value)
										)
									}
									className="h-11 w-48 flex outline-none"
								>
									<MenuItem value={0}>
										<p className="font-poppings text-sm text-gray-300">
											filter by Rating
										</p>
									</MenuItem>
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
					</div>

					<div className="flex flex-col lg:flex-row gap-3">
						<div>
							{(!!filterOption.title ||
								!!filterOption.rating) && (
								<Button
									onClick={handleClear}
									className="bg-red-500 text-red-50"
								>
									{" "}
									clear filter
									<CloseIcon className="text-red-50 cursor-pointer" />
								</Button>
							)}
						</div>
						<div>
							<Button
								onClick={handleOpen}
								className="shadow-lg bg-emerald-700 px-5 font-bold  text-emerald-50 hover:text-emerald-100 hover:px-5 hover:bg-emerald-800"
							>
								Add Movie
							</Button>
						</div>
					</div>
				</div>
			</div>
			<BasicModal
				handleOpen={handleOpen}
				open={open}
				handleClose={handleClose}
			/>
		</>
	);
}

export default Filter;
