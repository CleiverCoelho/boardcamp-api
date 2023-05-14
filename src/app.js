import express from "express";
import gamesRouter from "./routers/games.routers.js";

const app = express();
app.use(express.json());
app.use(gamesRouter);

app.listen(5000, () => {
  console.log("Server listening on port 5000.");
});
