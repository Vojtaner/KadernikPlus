"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="535a074f-aab3-521d-a70d-82a6f50ce5bd")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcedureController = void 0;
const add_or_update_procedure_1 = __importDefault(require("../../application/use-cases/procedures/add-or-update-procedure"));
const get_procedures_1 = __importDefault(require("../../application/use-cases/procedures/get-procedures"));
const delete_procedure_1 = __importDefault(require("../../application/use-cases/procedures/delete-procedure"));
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
    const deleteProcedureController = async (httpRequest) => {
        try {
            const procedureId = httpRequest.params.id;
            const result = await dependencies.deleteProcedureUseCase.execute(procedureId);
            return { statusCode: 200, body: result };
        }
        catch (error) {
            console.error("deleteProcedureController", error);
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
        deleteProcedureController,
    };
};
exports.createProcedureController = createProcedureController;
const procedureController = (0, exports.createProcedureController)({
    getProceduresUseCase: get_procedures_1.default,
    addOrUpdateProcedureUseCase: add_or_update_procedure_1.default,
    deleteProcedureUseCase: delete_procedure_1.default,
});
exports.default = procedureController;
//# sourceMappingURL=procedure-controller.js.map
//# debugId=535a074f-aab3-521d-a70d-82a6f50ce5bd
