import express from "express";
import gamesRouter from "./routers/games.routers.js";
import customerRouter from "./routers/customers.router.js";

const app = express();
app.use(express.json());
app.use(gamesRouter);
app.use(customerRouter);

app.listen(5000, () => {
  console.log("Server listening on port 5000.");
});
