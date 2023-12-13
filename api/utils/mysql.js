import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const database = process.env.database;
const username = process.env.MYSQL_USERNAME;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

async function initialize() {
	try {
		const connection = await mysql.createConnection({
			user: username,
			password,
		});
		await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
		await connection.query(`USE ${database}`);
	} catch (error) {
		console.error(
			"❌❌❌Unable to connect to the database",
			error.sqlMessage
		);
	}
}

initialize();

export const sequelize = new Sequelize(database, username, password, {
	host,
	dialect: "mysql",
	logging: false, //disable logging to the console
});
try {
	await sequelize.sync({ force: true });
	await sequelize.authenticate();
	console.log(
		"✔✔✔Connection has been established successfully.",
		`To dabatase ${database}`
	);
} catch (error) {
	console.error("❌❌❌Unable to connect to the database", error.sqlMessage);
}
