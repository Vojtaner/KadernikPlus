"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d2dc6b12-a54d-534c-a882-dce28535f18c")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const team_member_controller_1 = __importDefault(require("../infrastructure/controllers/team-member-controller"));
const express_1 = require("express");
const teamMemberRoutes = (0, express_1.Router)();
teamMemberRoutes.get("/", (0, make_express_callback_1.makeExpressCallback)(team_member_controller_1.default.getTeamMemberByUserIdController));
teamMemberRoutes.patch("/:teamId", (0, make_express_callback_1.makeExpressCallback)(team_member_controller_1.default.updateTeamMemberSkillController));
teamMemberRoutes.get("/:teamId", (0, make_express_callback_1.makeExpressCallback)(team_member_controller_1.default.getTeamMembersByTeamIdController));
teamMemberRoutes.post("/", (0, make_express_callback_1.makeExpressCallback)(team_member_controller_1.default.createTeamMemberController));
teamMemberRoutes.delete("/", (0, make_express_callback_1.makeExpressCallback)(team_member_controller_1.default.deleteTeamMemberController));
teamMemberRoutes.post("/invitation", (0, make_express_callback_1.makeExpressCallback)(team_member_controller_1.default.inviteOrSwitchTeamController));
exports.default = teamMemberRoutes;
//# sourceMappingURL=team-member-routes.js.map
//# debugId=d2dc6b12-a54d-534c-a882-dce28535f18c
