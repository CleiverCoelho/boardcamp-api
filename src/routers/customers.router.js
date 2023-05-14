import { Router } from "express";
import { createCustomer, findAllCustomers, findCustomersById } from "../controllers/customers.controller.js";

const customerRouter = Router();

customerRouter.get("/customers", findAllCustomers);
customerRouter.get("/customers/:id", findCustomersById);
customerRouter.post("/customers", createCustomer);

export default customerRouter;
