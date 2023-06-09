import express from "express";
import gamesRouter from "./routers/games.routers.js";
import customerRouter from "./routers/customers.router.js";
import rentalsRouter from "./routers/rentals.router.js";
import cors from "cors";
import dotenv from 'dotenv';


const app = express();
app.use(cors());
app.use(express.json());
app.use(gamesRouter);
app.use(customerRouter);
app.use(rentalsRouter);

dotenv.config();

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})