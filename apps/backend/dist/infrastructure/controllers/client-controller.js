"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_client_1 = __importDefault(require("../../application/use-cases/add-client"));
const get_client_by_id_1 = __importDefault(require("../../application/use-cases/get-client-by-id"));
const createClientController = (dependencies) => {
    const addClientController = async (httpRequest) => {
        try {
            const clientData = httpRequest.body;
            //ověřit body requestu, queries
            //provése usecase
            //vrátit výsledek
            const client = dependencies.addClientUseCase.execute(clientData);
            return {
                statusCode: 201,
                body: client,
            };
        }
        catch (error) {
            //například
            if (error.name === "UserNotFoundError" ||
                error.name === "ClientNotFoundError") {
                return {
                    statusCode: 400,
                    body: { error: error.message },
                };
            }
            console.error("Error in addClientController:", error);
            throw error;
        }
    };
    const getClientByIdController = async (httpRequest) => {
        try {
            const id = httpRequest.params.id;
            const client = await dependencies.getClientByIdUseCase.execute(id);
            return {
                statusCode: 201,
                body: client,
            };
        }
        catch (error) {
            if (error.name === "UserNotFoundError" ||
                error.name === "ClientNotFoundError") {
                return {
                    statusCode: 400,
                    body: { error: error.message },
                };
            }
            console.error("Error in getClientByIdController:", error);
            throw error;
        }
    };
    return { addClientController, getClientByIdController };
};
const clientController = createClientController({
    addClientUseCase: add_client_1.default,
    getClientByIdUseCase: get_client_by_id_1.default,
});
exports.default = clientController;
