import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
import visitController from "../infrastructure/controllers/visit-controller";

const visitRoutes = Router();

visitRoutes.post("/", makeExpressCallback(visitController.addVisitController));
// visitRoutes.get("/", makeExpressCallback(visitController.getVisitsController));

export default visitRoutes;
