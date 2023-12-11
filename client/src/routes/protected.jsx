/* eslint-disable react-hooks/rules-of-hooks */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Error from "../components/Error";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../graphql/cache";
import { CURRENT_USER } from "../graphql/user.queries";
import Navbar from "../components/Navbar";

export default function ProtectedRoute() {
	const navigate = useNavigate();
	const user = useReactiveVar(userVar);
	const { data, loading, error } =
		!user &&
		useQuery(CURRENT_USER, {
			fetchPolicy: "network-only",
		});

	const state = useLocation();
	useEffect(() => {
		if (data?.currentUser?.user) {
			userVar(data.currentUser.user);
		} else if (!loading) {
			if (!user && !loading) {
				navigate("/auth", { state: state });
			}
		}
	}, [data, loading, navigate, state, user]);

	if (loading) {
		return <div>Loading</div>;
	}
	if (error) {
		return <Error error={error} />;
	}
	return (
		<>
			{user && (
				<>
					<Navbar />
					<Outlet />
				</>
			)}
		</>
	);
}
