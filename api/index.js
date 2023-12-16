import express from "express";
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";
import morgan from "morgan";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { ApolloServer } from "apollo-server-express";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { typeDefs } from "./schema.js";
import resolvers from "./resolvers.js";
import { MovieAPI } from "./datasource/MovieDatasource.js";
import { UserAPI } from "./datasource/UserDatasource.js";
import { authenticateUser } from "./middlewares/authenticateUser.js";
import { ReviewAPI } from "./datasource/ReviewDatasource.js";
import { TmdbAPI } from "./datasource/RESTMovieDatasource.js";
import "./utils/mysql.js";

dotenv.config();

const frontEndUrl = process.env.FRONT_END_URL;
console.log({frontEndUrl})

const schema = makeExecutableSchema({ typeDefs, resolvers });

// express specific
const port = process.env.PORT;
const app = express();
app.use(cors({
	origin: ["https://omobolaji-moviex.vercel.app", "http://localhost:5173"]
}));

// setup Apollo Server
const server = new ApolloServer({
	schema,
	introspection: true,
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
		tmdbAPI: new TmdbAPI(),
	}),
	cache: new InMemoryLRUCache({
		//~100MiB
		maxSize: Math.pow(2, 20) * 100,
		// 5 minutes (in seconds)
		ttl: 300,
	}),
});
await server.start();


app.get("/", async (req, res) => {
	try {
		res.status(200).json({
			message: "go to /graphql to interact with our API.",
		});
	} catch (error) {
		res.status(500).send({ error });
	}
});

server.applyMiddleware({ app, path: '/graphql' });
// morgan
morgan("tiny");

//  Function that start up the server
async function start(port) {
	app.listen(port, (error) => {
		if (error) {
		  console.error('Server startup error:', error);
		  process.exit(1);
		}
		console.log(`Server running at http://localhost:${port}/graphql`);
	  });
}

start(port);
