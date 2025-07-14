import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import { StockItemController } from "../infrastructure/controllers";

const stockItemRoutes = Router();

stockItemRoutes.post(
  "/",
  makeExpressCallback(StockItemController.createStockItemController)
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
