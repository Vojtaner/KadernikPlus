"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_or_update_client_1 = __importDefault(require("../../application/use-cases/clients/add-or-update-client"));
const get_client_by_id_1 = __importDefault(require("../../application/use-cases/clients/get-client-by-id"));
const get_all_clients_1 = __importDefault(require("../../application/use-cases/clients/get-all-clients"));
const search_client_1 = __importDefault(require("../../application/use-cases/clients/search-client"));
const createClientController = (dependencies) => {
    const findClientsController = async (httpRequest) => {
        try {
            const { query } = httpRequest.query;
            const userId = httpRequest.userId;
            const clients = await dependencies.searchClientsUseCase.execute(userId, query);
            return {
                statusCode: 200,
                body: clients,
            };
        }
        catch (error) {
            console.error("Error in findClientsController:", error);
            return {
                statusCode: 500,
                body: { error: "Internal Server Error" },
            };
        }
    };
    const addOrUpdateClientController = async (httpRequest) => {
        try {
            const clientData = httpRequest.body;
            const userId = httpRequest.userId;
            const clientDataWithUserId = { ...clientData, userId };
            const newOrUpdatedClient = await dependencies.addOrUpdateClientUseCase.execute(clientDataWithUserId);
            return {
                statusCode: 201,
                body: newOrUpdatedClient,
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
            console.error("Error in addClientController:", error);
            throw error;
        }
    };
    const getAllClientsByUserIdController = async (httpRequest) => {
        try {
            const userId = httpRequest.userId;
            const clients = await dependencies.getAllClientsByUserIdUseCase.execute(userId);
            return {
                statusCode: 201,
                body: clients,
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
            console.error("Error in getAllClientsController:", error);
            throw error;
        }
    };
    const getClientByIdController = async (httpRequest) => {
        try {
            const clientId = httpRequest.params.clientId;
            const userId = httpRequest.userId;
            const client = await dependencies.getClientByIdUseCase.execute(clientId, userId);
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
    return {
        addOrUpdateClientController,
        getClientByIdController,
        getAllClientsByUserIdController,
        findClientsController,
    };
};
const clientController = createClientController({
    addOrUpdateClientUseCase: add_or_update_client_1.default,
    getClientByIdUseCase: get_client_by_id_1.default,
    getAllClientsByUserIdUseCase: get_all_clients_1.default,
    searchClientsUseCase: search_client_1.default,
});
exports.default = clientController;
