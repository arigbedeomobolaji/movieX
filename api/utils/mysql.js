import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const database = process.env.database;
const username = process.env.MYSQL_USERNAME;
const password = process.env.MYSQL_PASSWORD;

export const sequelize = new Sequelize(database, username, password, {
	host: "localhost",
	dialect: "mysql",
});

try {
	await sequelize.authenticate();
	console.log("✔✔✔Connection has been established successfully.");
} catch (error) {
	console.error("❌❌❌Unable to connect to the database", error.sqlMessage);
}
