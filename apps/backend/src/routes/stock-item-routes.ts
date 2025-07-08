import { Router } from "express";
import { makeExpressCallback } from "../utils/make-express-callback";
import { stockItemController } from "..";

const stockItemRoutes = Router();

// stockItemRoutes.post(
//   "/",
//   makeExpressCallback(stockItemController.addStockItemController)
// );
// stockItemRoutes.get(
//   "/",
//   makeExpressCallback(stockItemController.getAllStockItemsController)
// );
// stockItemRoutes.get(
//   "/:id",
//   makeExpressCallback(stockItemController.getStockItemByIdController)
// );
// stockItemRoutes.get(
//   "/by-name",
//   makeExpressCallback(stockItemController.findStockItemByNameController)
// );

export default stockItemRoutes;
