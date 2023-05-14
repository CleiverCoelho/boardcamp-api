import { Router } from "express";
import {
  createGame,
  findAllGames,
  findGamesById,
} from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", findAllGames);
gamesRouter.get("/games/:id", findGamesById);
gamesRouter.post("/games", createGame);

export default gamesRouter;
