import { Router } from "express";
import { closeRental, createRental, deleteRental, findAllRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals/", findAllRentals);
rentalsRouter.post("/rentals", createRental);
rentalsRouter.post("/rentals/:id/return", closeRental);
rentalsRouter.delete("/rentals/:id", deleteRental);


export default rentalsRouter;
