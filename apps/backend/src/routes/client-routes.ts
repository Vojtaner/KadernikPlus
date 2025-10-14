import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import clientController from "../infrastructure/controllers/client-controller";

const clientRoutes = Router();

clientRoutes.post(
  "/",
  makeExpressCallback(clientController.addOrUpdateClientController)
);
clientRoutes.post(
  "/import",
  makeExpressCallback(clientController.importClientsController)
);

clientRoutes.get(
  "/search",
  makeExpressCallback(clientController.findClientsController)
);

clientRoutes.get(
  "/",
  makeExpressCallback(clientController.getAllClientsByUserIdController)
);

clientRoutes.get(
  "/:clientId",
  makeExpressCallback(clientController.getClientByIdController)
);

export default clientRoutes;
