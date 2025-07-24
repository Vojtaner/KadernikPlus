import { makeExpressCallback } from "../adapters/express/make-express-callback";
import { Router } from "express";
import procedureController from "../infrastructure/controllers/procedure-controller";

const procedureRoutes = Router();

procedureRoutes.get(
  "/visit/:visitId",
  makeExpressCallback(procedureController.getProceduresController)
);
procedureRoutes.post(
  "/visit/:visitId",
  makeExpressCallback(procedureController.addOrUpdateProcedureController)
);

export default procedureRoutes;
