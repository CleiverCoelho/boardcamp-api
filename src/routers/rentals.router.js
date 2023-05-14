import { Router } from "express";
import { findAllRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", findAllRentals);
rentalsRouter.post("/rentals", );

export default rentalsRouter;
