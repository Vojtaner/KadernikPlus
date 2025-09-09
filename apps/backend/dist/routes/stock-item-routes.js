"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6d350dc5-e5de-57dd-80ac-7cce25d38625")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const controllers_1 = require("../infrastructure/controllers");
const stockItemRoutes = (0, express_1.Router)();
stockItemRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(controllers_1.StockItemController.createOrUpdateStockItemController));
stockItemRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(controllers_1.StockItemController.getStocksByUserIdController));
stockItemRoutes.get("/:stockId/items", (0, make_express_callback_1.makeExpressCallback)(controllers_1.StockItemController.getStockItemsByStockIdController));
stockItemRoutes.get("/item/:stockItemId", (0, make_express_callback_1.makeExpressCallback)(controllers_1.StockItemController.getStockItemByIdController));
stockItemRoutes.delete("/item/:stockItemId", (0, make_express_callback_1.makeExpressCallback)(controllers_1.StockItemController.deleteStockItemByIdController));
stockItemRoutes.get("/by-name", (0, make_express_callback_1.makeExpressCallback)(controllers_1.StockItemController.findStockItemByNameController));
exports.default = stockItemRoutes;
//# sourceMappingURL=stock-item-routes.js.map
//# debugId=6d350dc5-e5de-57dd-80ac-7cce25d38625
