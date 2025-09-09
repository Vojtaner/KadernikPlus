"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="32709ece-e5e8-59f3-b00c-ae11c3c933c3")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_express_callback_1 = require("../adapters/express/make-express-callback");
const express_1 = require("express");
const procedure_controller_1 = __importDefault(require("../infrastructure/controllers/procedure-controller"));
const procedureRoutes = (0, express_1.Router)();
procedureRoutes.get("/visit/:visitId", (0, make_express_callback_1.makeExpressCallback)(procedure_controller_1.default.getProceduresController));
procedureRoutes.post("/visit/:visitId", (0, make_express_callback_1.makeExpressCallback)(procedure_controller_1.default.addOrUpdateProcedureController));
procedureRoutes.delete("/:id", (0, make_express_callback_1.makeExpressCallback)(procedure_controller_1.default.deleteProcedureController));
exports.default = procedureRoutes;
//# sourceMappingURL=procedure-routes.js.map
//# debugId=32709ece-e5e8-59f3-b00c-ae11c3c933c3
