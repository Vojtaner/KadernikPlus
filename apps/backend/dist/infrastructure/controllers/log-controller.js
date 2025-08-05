"use strict";
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
