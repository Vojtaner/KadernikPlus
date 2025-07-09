"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const make_express_callback_1 = require("../utils/make-express-callback");
const visit_controller_1 = __importDefault(require("../infrastructure/controllers/visit-controller"));
const visitRoutes = (0, express_1.Router)();
visitRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(visit_controller_1.default.addVisitController));
visitRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(visit_controller_1.default.getVisitsController));
visitRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(visit_controller_1.default.findVisitByIdController));
exports.default = visitRoutes;
