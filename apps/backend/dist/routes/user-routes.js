"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b67bd28a-4b03-559a-b0ef-17481a92203b")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const index_1 = require("../infrastructure/controllers/index");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(index_1.UserController.addUserController));
userRoutes.get("/:id", (0, make_express_callback_1.makeExpressCallback)(index_1.UserController.getUserByIdController));
exports.default = userRoutes;
//# sourceMappingURL=user-routes.js.map
//# debugId=b67bd28a-4b03-559a-b0ef-17481a92203b
