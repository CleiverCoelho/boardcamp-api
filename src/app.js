import express from "express";
import gamesRouter from "./routers/games.routers.js";
import customerRouter from "./routers/customers.router.js";
import rentalsRouter from "./routers/rentals.router.js";

const app = express();
app.use(express.json());
app.use(gamesRouter);
app.use(customerRouter);
app.use(rentalsRouter);

dotev.config()

const port = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`)
})