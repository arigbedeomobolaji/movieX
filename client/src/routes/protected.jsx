import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAUth";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function ProtectedRoute() {
	const navigate = useNavigate();
	const { token } = useAuth();

	useEffect(() => {
		if (!token) {
			navigate("/auth");
		}
	}, [navigate, token]);
	if (!token) {
		return <div>Loading</div>;
	}

	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
