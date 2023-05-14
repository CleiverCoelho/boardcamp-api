import { Router } from "express";
import {
  createGame,
  findAllGames,
} from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", findAllGames);
gamesRouter.post("/games", createGame);

export default gamesRouter;
