import { Router } from "express";
import { createCustomer, findAllCustomers, findCustomersById, updateCustomer } from "../controllers/customers.controller.js";

const customerRouter = Router();

customerRouter.get("/customers", findAllCustomers);
customerRouter.get("/customers/:id", findCustomersById);
customerRouter.post("/customers", createCustomer);
customerRouter.put("/customers/:id", updateCustomer);

export default customerRouter;
