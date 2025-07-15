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
  makeExpressCallback(StockItemController.getStocksByUserIdController)
);

stockItemRoutes.get(
  "/:stockId/items",
  makeExpressCallback(StockItemController.getStockItemsByStockIdController)
);

stockItemRoutes.get(
  "/item/:stockItemId",
  makeExpressCallback(StockItemController.getStockItemByIdController)
);

stockItemRoutes.get(
  "/by-name",
  makeExpressCallback(StockItemController.findStockItemByNameController)
);

export default stockItemRoutes;
