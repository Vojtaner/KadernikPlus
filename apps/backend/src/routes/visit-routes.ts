import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
import { VisitController } from "../infrastructure/controllers/index";

const visitRoutes = Router();

visitRoutes.post("/", makeExpressCallback(VisitController.addVisitController));
visitRoutes.get("/", makeExpressCallback(VisitController.getVisitsController));
visitRoutes.get(
  "/",
  makeExpressCallback(VisitController.findVisitByIdController)
);

export default visitRoutes;
