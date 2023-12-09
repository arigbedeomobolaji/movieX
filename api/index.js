import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import createError from "http-errors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { typeDefs } from "./schema.js";
import resolvers from "./resolvers.js";
import "./utils/mysql.js";
import { MovieAPI } from "./datasource/MovieDatasource.js";
import { UserAPI } from "./datasource/UserDatasource.js";
import { authenticateUser } from "./middlewares/authenticateUser.js";
import { ReviewAPI } from "./datasource/ReviewDatasource.js";
import { sequelize } from "./utils/mysql.js";
dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
	schema,
	context: async ({ req }) => {
		// Extract the token from the Authorization header
		const authorizationStr = req.headers.authorization || "";
		const token = authorizationStr.split(" ")[1];
		// Authenticate the user and add the user object to the context
		const user = token ? await authenticateUser(token) : null;
		return typeof user === "object" ? { user } : null;
	},

	dataSources: () => ({
		movieAPI: new MovieAPI(),
		userAPI: new UserAPI(),
		reviewAPI: new ReviewAPI(),
	}),
	cache: new InMemoryLRUCache({
		//~100MiB
		maxSize: Math.pow(2, 20) * 100,
		// 5 minutes (in seconds)
		ttl: 300,
	}),
});

await server.start();

// express specific
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
server.applyMiddleware({ app });

app.get("/", async (req, res) => {
	try {
		console.log("here");
		res.status(200).json({
			message: "go to /graphql to interact with our API.",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ error });
	}
});
// morgan
morgan(function (tokens, req, res) {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, "content-length"),
		"-",
		tokens["response-time"](req, res),
		"ms",
	].join(" ");
});

// Logs out error
app.use(function (req, res, next) {
	if (!req.user)
		return next(createError(401, "Please login to view this page."));
	next();
});

//  Function that start up the server
function start(port) {
	try {
		app.listen(port, (err) => {
			if (err) throw err;
			console.log("✔✔✔Server is running on port", port);
		});
	} catch (error) {
		console.log("❌❌❌Error: Connection not made to the server", error);
	}
}

start(port);
