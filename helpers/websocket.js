const mqtt = require("mqtt");

const websocketUrl = process.env.MQTT_URL;
const topic = process.env.MQTT_TOPIC;
const settings = {
	cliendId: `mqtt_whatsapp_${Math.random().toString(16).slice(3)}`,
	clean: true,
	username: process.env.MQTT_USER,
	password: process.env.MQTT_PASSWORD,
};
const { log, error } = console;

const getClient = () => {
	const client = mqtt.connect(websocketUrl, settings);
	client.stream.on("error", (err) => {
		error(`Connection to ${websocketUrl} failed: ${err}`);
		client.end();
	});
	client.on("connect", () => log("Mqtt conection has been established successfully."));
	client.on("error", (err) => error(`Connection to ${websocketUrl} failed: ${err}`));
	return client;
};
const subscribe = (client) => {
	const callBack = (err, granted) => {
		if (err) {
			error("Subscription request failed");
		}
		granted.map((grant) => log(`Subscribe successfully to ${grant.topic}`));
	};
	return client.subscribe(topic, callBack);
};
const onMessage = (client, callback) => {
	client.on("message", (topic, message, packet) => {
		log(`${topic}: ${message}`);
		callback();
	});
};
const unsubscribe = (client) => {
	client.unsubscribe(topic);
};
const closeConnection = (client) => {
	log("Conection closed");
	client.end();
};

module.exports = {
	getClient,
	subscribe,
	onMessage,
	unsubscribe,
	closeConnection,
};
