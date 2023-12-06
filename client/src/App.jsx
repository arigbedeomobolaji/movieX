import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./components/error-page";
import Movies from "./routes/layout/movies";
import Movie from "./routes/movie";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Movies />,
			},
			{
				path: "/movies/:movieId",
				element: <Movie />,
			},
		],
	},
	{
		path: "/movies/:movieId",
		element: <div>Movies</div>,
		errorElement: <ErrorPage />,
	},
]);
export default function App() {
	return <RouterProvider router={router}></RouterProvider>;
}
