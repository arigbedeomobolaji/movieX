/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { userVar } from "../graphql/cache";
import { LOGOUT, LOGOUT_ALL } from "../graphql/user.mutation";
import { CURRENT_USER } from "../graphql/user.queries";
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

function Navbar({isOpen, setIsOpen}) {
	const navigate = useNavigate();
	const user = useReactiveVar(userVar);
	const token = JSON.parse(localStorage.getItem("token"));
	const { data } = useQuery(CURRENT_USER, {
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		console.log("Navbar rendered.")
	}, [])

	useEffect(() => {
		if (data?.currentUser?.user) {
			userVar(data.currentUser.user);
		}
	}, [data]);

	const [logout] = useMutation(LOGOUT, {
		variables: {
			userId: Number(user?.id),
			token,
		},
	});

	const [logoutAll] = useMutation(LOGOUT_ALL, {
		variables: {
			userId: Number(user?.id),
		},
	});

	function handleLogout() {
		logout();
		userVar(null);
		localStorage.removeItem("token");
		navigate("/");
	}

	function handleLogoutAll() {
		logoutAll();
		userVar(null);
		localStorage.removeItem("token");
		navigate("/");
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-40 ">
			<div className="shadow-lg p-4 font-poppings bg-gradient-to-l from-purple-400 from-10% via-50% to-emerald-400 to-90%">
				<div className="flex max-w-7xl justify-between items-center mx-auto">
					<Link to="/" className="no-underline">
						<div className="flex items-center gap-2">
							<img
								src="https://img.freepik.com/premium-vector/eagle-gradient-logo-design-illustration_474888-842.jpg?size=626&ext=jpg&ga=GA1.1.567223693.1687376094&semt=ais"
								alt="BrandLogo"
								className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
							/>
							<h1 className="text-emerald-50 font-sans font-[400] text-[18px] md:text-[26px] tracking-wider">
								MOVIEX
							</h1>
						</div>
					</Link>

					<div className="relative flex items-center gap-3">
						{isOpen && (
							<div className="flex flex-col flex-grow px-2 py-4 z-[60] top-14 right-0 w-[200px] shadow-md bg-gray-50 rounded-md gap-3 absolute">
								{user && (
									<>
										<Button
											className="bg-purple-500 text-white text-xs rounded-md px-1 sm:px-3 shadow-lg py-3"
											onClick={handleLogout}
										>
											Logout
										</Button>

										<Button
											className="bg-emerald-400 text-white text-xs rounded-md px-1 sm:px-3 shadow-lg py-3"
											onClick={handleLogoutAll}
										>
											out All
										</Button>
									</>
								)}

								<Link
									to="/movies"
									className="capitalize no-underline text-emerald-600 text-[16px] px-1 sm:px-3 py-3"
								>
									pagMovies
								</Link>
							</div>
						)}
						<div className="flex items-center gap-3">
							{!user && (
								<Button
									className="bg-purple-500 text-white rounded-md px-3"
									onClick={() => navigate("/auth")}
								>
									Login
								</Button>
							)}

							<AnchorLink
								className="text-white font-poppings no-underline"
								href="#top"
							>
								Top
							</AnchorLink>
							<RxHamburgerMenu
								onClick={() => setIsOpen(!isOpen)}
								className="text-[40px] text-emerald-600 cursor-pointer"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
