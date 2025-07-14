import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import clientController from "../infrastructure/controllers/client-controller";

const clientRoutes = Router();

clientRoutes.post(
  "/",
  makeExpressCallback(clientController.addClientController)
);

clientRoutes.get(
  "/:id",
  makeExpressCallback(clientController.getClientByIdController)
);

export default clientRoutes;
