const path = require("path");

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });
}

const db = require("./helpers/database");
const mqtt = require("./helpers/websocket");

// Probando coniexion a la BD
db.authenticate()
	.then(() => {
		console.log("Database connection has been established successfully.");
		db.close();
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

// Probando conexion MQTT
let client = mqtt.getClient();
mqtt.subscribe(client);
mqtt.onMessage(client, () => mqtt.closeConnection(client));
