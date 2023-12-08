/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import {
	ApolloClient,
	ApolloLink,
	ApolloProvider,
	concat,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import App from "./App.jsx";
import { cache } from "./graphql/cache.js";
import "./index.css";

const httpLink = createHttpLink({
	uri: "http://localhost:3003/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
	const token = JSON.parse(localStorage.getItem("token"));

	operation.setContext(({ headers }) => ({
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	}));
	return forward(operation);
});

// const authLink = setContext((_, { headers }) => {
// 	const token = localStorage.getItem("token");

// 	return {
// 		headers: {
// 			...headers,
// 			authorization: token ? `Bearer ${token}` : "",
// 		},
// 	};
// });

const client = new ApolloClient({
	link: concat(authMiddleware, httpLink),
	cache,
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ApolloProvider>
);
