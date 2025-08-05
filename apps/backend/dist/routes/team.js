"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const team_controller_1 = __importDefault(require("../infrastructure/controllers/team-controller"));
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const express_1 = require("express");
const teamRoutes = (0, express_1.Router)();
teamRoutes.get("/:teamId", (0, make_express_callback_1.makeExpressCallback)(team_controller_1.default.getTeamController));
// teamRoutes.post(
//   "/",
//   makeExpressCallback(teamController.createTeamController)
// );
exports.default = teamRoutes;
