import { makeExpressCallback } from "../adapters/express/make-express-callback";
import stockAllowanceController from "../infrastructure/controllers/stock-allowance-controller";
import { Router } from "express";

const stockAllowanecRoutes = Router();

stockAllowanecRoutes.get(
  "/:teamId",
  makeExpressCallback(
    stockAllowanceController.getAllStockAllowancesByTeamIdController
  )
);

export default stockAllowanecRoutes;
