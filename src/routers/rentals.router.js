import { Router } from "express";
import { createRental, findAllRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", findAllRentals);
rentalsRouter.post("/rentals", createRental);

export default rentalsRouter;
