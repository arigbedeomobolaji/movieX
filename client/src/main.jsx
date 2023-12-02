/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";

import { ApolloClient, ApolloProvider } from "@apollo/client";
import App from "./App.jsx";
import { cache } from "./graphql/cache.js";
import "./index.css";

const client = new ApolloClient({
	uri: "http://localhost:3003/graphql",
	cache,
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ApolloProvider>
);
