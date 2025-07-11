import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
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
