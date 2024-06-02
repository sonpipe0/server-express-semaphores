import express, { Express, Response } from "express";
import semaphoreRouter from "./controllers/semaphoreController";
import mqtt from "mqtt";
import cors from "cors";
import auth from "./controllers/authController";
import { connectToDatabase } from "./config/database";
import { filterBySessionId } from "./middleware/sessionFilter";
import client from "./mqtt";

require("dotenv").config();
const app = express();

app.use(express.json()); // To parse JSON bodies

connectToDatabase();

const topic: mqtt.MqttClient = client.subscribe("semaphore/create");

app.use(cors());
app.all("*", filterBySessionId);

app.use("/auth", auth);
app.use("/semaphore", semaphoreRouter);

const PORT = 3000;
const HOST = '172.31.23.248'; // Replace with your private IP address

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
