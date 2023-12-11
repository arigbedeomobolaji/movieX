import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./components/error-page";
import Movies from "./routes/layout/movies";
import Auth from "./routes/auth";
import ProtectedRoute from "./routes/protected";
import MovieDetails from "./routes/MovieDetail";

const router = createBrowserRouter([
	{
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Movies />,
			},
			{
				path: "/auth",
				element: <Auth />,
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: "/movies/:movieId",
						element: <MovieDetails />,
					},
				],
			},
		],
	},
]);
export default function App() {
	return <RouterProvider router={router}></RouterProvider>;
}
