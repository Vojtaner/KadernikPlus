"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fe72ac91-8c27-5e6b-a717-338628506666")}catch(e){}}();

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
//# sourceMappingURL=team.js.map
//# debugId=fe72ac91-8c27-5e6b-a717-338628506666
