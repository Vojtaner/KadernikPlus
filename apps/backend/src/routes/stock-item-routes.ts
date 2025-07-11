import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
import { StockItemController } from "../infrastructure/controllers";

const stockItemRoutes = Router();

stockItemRoutes.post(
  "/",
  makeExpressCallback(StockItemController.addStockItemController)
);
stockItemRoutes.get(
  "/",
  makeExpressCallback(StockItemController.getAllStockItemsController)
);
stockItemRoutes.get(
  "/:id",
  makeExpressCallback(StockItemController.getStockItemByIdController)
);
stockItemRoutes.get(
  "/by-name",
  makeExpressCallback(StockItemController.findStockItemByNameController)
);

export default stockItemRoutes;
