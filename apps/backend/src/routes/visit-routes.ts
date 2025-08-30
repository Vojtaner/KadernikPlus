import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import { VisitController } from "../infrastructure/controllers/index";

const visitRoutes = Router();

visitRoutes.post("/", makeExpressCallback(VisitController.addVisitController));
visitRoutes.get(
  "/",
  makeExpressCallback(VisitController.getVisitsByDatesController)
);
visitRoutes.patch(
  "/status",
  makeExpressCallback(VisitController.updateVisitStatusController)
);
visitRoutes.patch(
  "/:visitId",
  makeExpressCallback(VisitController.updateVisitController)
);
visitRoutes.get(
  "/:visitId",
  makeExpressCallback(VisitController.getVisitByIdController)
);
visitRoutes.get(
  "/client/:clientId",
  makeExpressCallback(VisitController.getVisitsByClientIdController)
);
visitRoutes.delete(
  "/client/:visitId",
  makeExpressCallback(VisitController.deleteVisitController)
);

export default visitRoutes;
