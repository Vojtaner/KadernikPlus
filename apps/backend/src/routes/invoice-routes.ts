import { makeExpressCallback } from "../adapters/express/make-express-callback";
import invoiceController from "../infrastructure/controllers/invoice-controller";
import { Router } from "express";

const invoiceRouter = Router();

invoiceRouter.get(
  "/",
  makeExpressCallback(invoiceController.getSubscriptionController)
);

export default invoiceRouter;
