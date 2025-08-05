"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcedureController = void 0;
const add_or_update_procedure_1 = __importDefault(require("../../application/use-cases/procedures/add-or-update-procedure"));
const get_procedures_1 = __importDefault(require("../../application/use-cases/procedures/get-procedures"));
const createProcedureController = (dependencies) => {
    const getProceduresController = async (httpRequest) => {
        try {
            const visitId = httpRequest.params.visitId;
            const result = await dependencies.getProceduresUseCase.execute(visitId);
            return { statusCode: 200, body: result };
        }
        catch (error) {
            console.error("getProceduresController", error);
            return { statusCode: 500, body: { error: error.message } };
        }
    };
    const addOrUpdateProcedureController = async (httpRequest) => {
        try {
            const visitId = httpRequest.params.visitId;
            const procedureData = {
                ...httpRequest.body,
                visitId,
                userId: httpRequest.userId,
            };
            const result = await dependencies.addOrUpdateProcedureUseCase.execute(procedureData);
            return { statusCode: 201, body: result };
        }
        catch (error) {
            console.error("addOrUpdateProcedureController", error);
            return { statusCode: 400, body: { error: error.message } };
        }
    };
    return {
        getProceduresController,
        addOrUpdateProcedureController,
    };
};
exports.createProcedureController = createProcedureController;
const procedureController = (0, exports.createProcedureController)({
    getProceduresUseCase: get_procedures_1.default,
    addOrUpdateProcedureUseCase: add_or_update_procedure_1.default,
});
exports.default = procedureController;
