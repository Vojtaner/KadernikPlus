import { Router } from "express";
import { makeExpressCallback } from "../adapters/express/make-express-callback";
import { StockItemController } from "../infrastructure/controllers";

const stockItemRoutes = Router();

stockItemRoutes.post(
  "/",
  makeExpressCallback(StockItemController.createOrUpdateStockItemController)
);

stockItemRoutes.get(
  "/",
  makeExpressCallback(StockItemController.getStocksByUserIdController)
);

stockItemRoutes.get(
  "/items",
  makeExpressCallback(
    StockItemController.getStockItemsByStockIdOrUserIdController
  )
);

stockItemRoutes.get(
  "/item/:stockItemId",
  makeExpressCallback(StockItemController.getStockItemByIdController)
);

stockItemRoutes.delete(
  "/item/:stockItemId",
  makeExpressCallback(StockItemController.deleteStockItemByIdController)
);

stockItemRoutes.get(
  "/by-name",
  makeExpressCallback(StockItemController.findStockItemByNameController)
);

export default stockItemRoutes;
