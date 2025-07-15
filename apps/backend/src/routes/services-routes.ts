import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import serviceController from "../infrastructure/controllers/service-controller";

const serviceRoutes = Router();

serviceRoutes.post(
  "/",
  makeExpressCallback(serviceController.addServiceController)
);

serviceRoutes.get(
  "/",
  makeExpressCallback(serviceController.getAllServicesController)
);

export default serviceRoutes;
