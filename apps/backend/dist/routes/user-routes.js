"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const index_1 = require("../infrastructure/controllers/index");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(index_1.UserController.addUserController));
userRoutes.get("/:id", (0, make_express_callback_1.makeExpressCallback)(index_1.UserController.getUserByIdController));
exports.default = userRoutes;
