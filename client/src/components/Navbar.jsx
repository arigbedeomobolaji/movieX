import { useMutation, useReactiveVar } from "@apollo/client";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { userVar } from "../graphql/cache";
import { LOGOUT, LOGOUT_ALL } from "../graphql/user.mutation";

function Navbar() {
	const navigate = useNavigate();
	const user = useReactiveVar(userVar);
	const token = JSON.parse(localStorage.getItem("token"));
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
		<div className="shadow-lg p-4 font-poppings bg-gradient-to-l from-purple-400 from-10% via-50% to-emerald-400 to-90%">
			<div className="flex max-w-7xl justify-between items-center mx-auto">
				<Link to="/" className="no-underline">
					<div className="flex items-center gap-2">
						<img
							src="https://img.freepik.com/premium-vector/eagle-gradient-logo-design-illustration_474888-842.jpg?size=626&ext=jpg&ga=GA1.1.567223693.1687376094&semt=ais"
							alt="BrandLogo"
							className="w-12 h-12 rounded-full"
						/>
						<h1 className="text-emerald-50 font-sans font-[400] text-[26px] tracking-wider">
							MOVIEX
						</h1>
					</div>
				</Link>

				<div className="relative flex items-center gap-3">
					{user ? (
						<div className="flex gap-3">
							<Button
								className="bg-purple-500 text-white rounded-md px-3 shadow-lg"
								onClick={handleLogout}
							>
								Logout
							</Button>
							<Button
								className="bg-emerald-400 text-white rounded-md px-3 shadow-lg"
								onClick={handleLogoutAll}
							>
								Logout All
							</Button>
						</div>
					) : (
						<Button
							className="bg-purple-500 text-white rounded-md px-3"
							onClick={() => navigate("/auth")}
						>
							Login
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Navbar;
