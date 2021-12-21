const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
}

const db = require('./helpers/database');
const mqtt = require('./helpers/websocket');

const { log, error } = console;

// Probando coniexion a la BD
db.authenticate()
  .then(() => {
    log('Database connection has been established successfully.');
    db.close();
  })
  .catch((err) => {
    error('Unable to connect to the database:', err);
  });

// Probando conexion MQTT
const client = mqtt.getClient();
mqtt.subscribe(client);
mqtt.onMessage(client, () => mqtt.closeConnection(client));
