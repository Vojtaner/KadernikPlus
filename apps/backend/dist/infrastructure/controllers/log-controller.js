"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bfdded81-730f-5dd7-9eef-5accd2402f7d")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_logs_1 = __importDefault(require("../../application/use-cases/logs/get-all-logs"));
const createLogController = (dependencies) => {
    const getAllLogsController = async (httpRequest) => {
        const userId = httpRequest.userId;
        const logs = await dependencies.getAllLogsUseCase.execute(userId);
        return {
            statusCode: 200,
            body: logs,
        };
    };
    return {
        getAllLogsController,
    };
};
const logController = createLogController({
    getAllLogsUseCase: get_all_logs_1.default,
});
exports.default = logController;
//# sourceMappingURL=log-controller.js.map
//# debugId=bfdded81-730f-5dd7-9eef-5accd2402f7d
