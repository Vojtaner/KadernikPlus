"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fb35d1b0-4bde-58e1-b27b-940530bd6162")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_stock_allowances_by_team_id_1 = __importDefault(require("../../application/use-cases/stock-allowances/get-all-stock-allowances-by-team-id"));
const createStockAllowanceController = (dependencies) => {
    const getAllStockAllowancesByTeamIdController = async (httpRequest) => {
        const { teamId } = httpRequest.params;
        const { fromDate, toDate } = httpRequest.query;
        console.log({ httpRequest });
        try {
            const stockAllowances = await dependencies.getAllStockAllowancesByTeamIdUseCase.execute(teamId, fromDate, toDate);
            return {
                statusCode: 200,
                body: stockAllowances,
            };
        }
        catch (error) {
            console.error("getAllStockAllowancesByTeamIdController", error);
            return {
                statusCode: 500,
                body: { error: "Server error" },
            };
        }
    };
    return { getAllStockAllowancesByTeamIdController };
};
const stockAllowanceController = createStockAllowanceController({
    getAllStockAllowancesByTeamIdUseCase: get_all_stock_allowances_by_team_id_1.default,
});
exports.default = stockAllowanceController;
//# sourceMappingURL=stock-allowance-controller.js.map
//# debugId=fb35d1b0-4bde-58e1-b27b-940530bd6162
