import { Router } from "express";
import { closeRental, createRental, findAllRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", findAllRentals);
rentalsRouter.post("/rentals", createRental);
rentalsRouter.post("/rentals/:id/return", closeRental);


export default rentalsRouter;
