import express, { Express, Response } from "express";
import semaphoreRouter from "./controllers/semaphoreController";
import cors from "cors";
import auth from "./controllers/authController";
import { connectToDatabase } from "./config/database";
import { filterBySessionId } from "./middleware/sessionFilter";
import client from "./mqtt";

require("dotenv").config();
const app = express();

app.use(express.json()); // To parse JSON bodies

connectToDatabase();

client.on("connect", () => {
    client.subscribe("semaphore/create");
    client.subscribe("semaphore/obstruction");

});

client.on("message", (topic, message) => {
    console.log(`Received message on ${topic}: ${message}`);
});
app.use(cors());
app.all("*", filterBySessionId);

app.use("/auth", auth);
app.use("/semaphore", semaphoreRouter);

const PORT = 3000;

app.listen(PORT, () => {
});
