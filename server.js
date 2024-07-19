import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import redis from "redis";
import UsersController from './src/controllers/users.controller.js';
import AnimalsController from './src/controllers/animals.controller.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const REDIS_PORT = process.env.REDIS_PORT;
const host = process.env.HOST;

// Create Redis client
const redisClient = redis.createClient({ host: host, port: REDIS_PORT });

// Event listeners for Redis client
(() => {
  redisClient.on('ready', () => console.log('Redis client ready'));
  redisClient.on('error', (error) => console.log(`Redis client error: ${error}`));
  redisClient.on('connect', () => console.log(`Connected to Redis on Port: ${REDIS_PORT}`));
  redisClient.on('reconnect', () => console.log('Redis client reconnected'));
})();

app.use(cors('*')); // Enabling connection from another domain or server such as the front end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', UsersController);
app.use('/animals', AnimalsController);

app.get('/', function (req, res) {
  res.send('Welcome To My Api');
});

app.listen(PORT, host, () => {
  console.log(`Listening on port = ${PORT}`);
});

export default app;
