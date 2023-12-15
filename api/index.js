import express from "express";
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import morgan from "morgan";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { typeDefs } from "./schema.js";
import resolvers from "./resolvers.js";
import { MovieAPI } from "./datasource/MovieDatasource.js";
import { UserAPI } from "./datasource/UserDatasource.js";
import { authenticateUser } from "./middlewares/authenticateUser.js";
import { ReviewAPI } from "./datasource/ReviewDatasource.js";
import { TmdbAPI } from "./datasource/RESTMovieDatasource.js";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import "./utils/mysql.js";

dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });

// express specific
const port = process.env.PORT;
const app = express();
const httpServer = http.createServer(app);
app.use(express.json());

// setup Apollo Server
const server = new ApolloServer({
	schema,
	introspection: true,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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


  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(cors());
// server.applyMiddleware({ app });
app.use("/graphql",
cors({
	origin: process.env.FRONT_END_URL,
	credentials: true
}),
	expressMiddleware(server),
  );

app.get("/", async (req, res) => {
	try {
		res.status(200).json({
			message: "go to /graphql to interact with our API.",
		});
	} catch (error) {
		res.status(500).send({ error });
	}
});

// morgan
morgan("tiny");

//  Function that start up the server
async function start(port) {
	await new Promise((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}`);
}

start(port);
