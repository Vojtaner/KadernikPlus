"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_visit_1 = require("../../application/use-cases/visits/add-visit");
const get_visit_by_id_1 = __importDefault(require("../../application/use-cases/visits/get-visit-by-id"));
const get_visits_by_client_id_1 = __importDefault(require("../../application/use-cases/visits/get-visits-by-client-id"));
const get_visits_by_date_1 = __importDefault(require("../../application/use-cases/visits/get-visits-by-date"));
const delete_visit_1 = __importDefault(require("../../application/use-cases/visits/delete-visit"));
const update_visit_1 = require("../../application/use-cases/visits/update-visit");
const update_visit_status_1 = __importDefault(require("../../application/use-cases/visits/update-visit-status"));
const add_or_update_client_1 = __importDefault(require("../../application/use-cases/clients/add-or-update-client"));
const createVisitController = (dependencies) => {
    const addVisitController = async (httpRequest) => {
        function addHours(date, hours) {
            return new Date(date.getTime() + hours * 60 * 60 * 1000);
        }
        try {
            const visitData = httpRequest.body;
            const original = new Date(visitData.date);
            const shiftedTime = addHours(original, 2);
            const userId = httpRequest.userId;
            const visitDataWithUserId = { ...visitData, userId, date: shiftedTime };
            if (!visitData.clientId &&
                visitData.firstName &&
                visitData.lastName &&
                visitData.phone) {
                const clientData = {
                    id: "",
                    firstName: visitData.firstName,
                    lastName: visitData.lastName,
                    phone: visitData.phone,
                    note: visitData.note,
                    userId,
                    deposit: true,
                };
                const newClient = await dependencies.addOrUpdateClientUseCase.execute(clientData);
                const newVisit = await dependencies.addVisitUseCase.execute({
                    ...visitDataWithUserId,
                    clientId: newClient.id,
                });
                return {
                    statusCode: 201,
                    body: newVisit,
                };
            }
            else if (!visitData.clientId || !visitDataWithUserId.date || !userId) {
                return {
                    statusCode: 400,
                    body: {
                        error: "Missing required visit fields: clientId, userId, date.",
                    },
                };
            }
            const newVisit = await dependencies.addVisitUseCase.execute(visitDataWithUserId);
            return {
                statusCode: 201,
                body: newVisit,
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
            console.error("Error in addVisitController:", error);
            throw error;
        }
    };
    const getVisitsByDatesController = async (httpRequest) => {
        const { to, from } = httpRequest.query;
        const now = new Date();
        const effectiveFrom = from ? from : now;
        const effectiveTo = to
            ? to
            : new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days ahead
        const userId = httpRequest.userId;
        try {
            const visits = await dependencies.getVisitsByDatesUseCase.execute({
                from: effectiveFrom,
                to: effectiveTo,
                userId: userId,
            });
            return {
                statusCode: 200,
                body: visits,
            };
        }
        catch (error) {
            if (error.name === "ClientNotFoundError") {
                return {
                    statusCode: 400,
                    body: { error: error.message },
                };
            }
            console.error("Error in getVisitsController:", error);
            throw error;
        }
    };
    const getVisitByIdController = async (httpRequest) => {
        try {
            const { visitId } = httpRequest.params;
            const visit = await dependencies.getVisitByIdUseCase.execute(visitId);
            return {
                statusCode: 200,
                body: visit,
            };
        }
        catch (error) {
            if (error.name === "VisitNotFoundError") {
                return {
                    statusCode: 400,
                    body: { error: error.message },
                };
            }
            console.error("Error in findVisitByIdController:", error);
            throw error;
        }
    };
    const updateVisitStatusController = async (httpRequest) => {
        try {
            const { visitId, status } = httpRequest.body;
            if (!visitId || typeof status !== "boolean") {
                throw Error("Missing or invalid visitId or checked");
            }
            const updatedVisit = await dependencies.updateVisitStatusUseCase.execute({
                visitId,
                status,
            });
            return {
                statusCode: 200,
                body: updatedVisit,
            };
        }
        catch (err) {
            throw err;
        }
    };
    const updateVisitController = async (httpRequest) => {
        try {
            const visitId = httpRequest.params.visitId;
            const visitData = httpRequest.body;
            const updatedVisit = await dependencies.updateVisitUseCase.execute({
                id: visitId,
                ...visitData,
            });
            return {
                statusCode: 200,
                body: updatedVisit,
            };
        }
        catch (error) {
            if (error.name === "VisitNotFoundError") {
                return {
                    statusCode: 404,
                    body: { error: error.message },
                };
            }
            console.error("Error in updateVisitController:", error);
            throw error;
        }
    };
    const getVisitsByClientIdController = async (httpRequest) => {
        try {
            const clientId = httpRequest.params.clientId;
            const userId = httpRequest.userId;
            const visits = await dependencies.getVisitsByClientIdUseCase.execute(clientId, userId);
            return {
                statusCode: 200,
                body: visits,
            };
        }
        catch (error) {
            if (error.name === "ClientNotFoundError") {
                return {
                    statusCode: 404,
                    body: { error: error.message },
                };
            }
            console.error("Error in getVisitsByClientIdController:", error);
            throw error;
        }
    };
    const deleteVisitController = async (httpRequest) => {
        try {
            const visitId = httpRequest.params.id;
            await dependencies.deleteVisitUseCase.execute(visitId);
            return {
                statusCode: 204,
                body: null,
            };
        }
        catch (error) {
            if (error.name === "VisitNotFoundError") {
                return {
                    statusCode: 404,
                    body: { error: error.message },
                };
            }
            console.error("Error in deleteVisitController:", error);
            throw error;
        }
    };
    return {
        addVisitController,
        getVisitsByDatesController,
        getVisitsByClientIdController,
        getVisitByIdController,
        updateVisitController,
        deleteVisitController,
        updateVisitStatusController,
    };
};
const visitController = createVisitController({
    addVisitUseCase: add_visit_1.addVisitUseCase,
    getVisitsByDatesUseCase: get_visits_by_date_1.default,
    getVisitsByClientIdUseCase: get_visits_by_client_id_1.default,
    getVisitByIdUseCase: get_visit_by_id_1.default,
    updateVisitUseCase: update_visit_1.updateVisitUseCase,
    deleteVisitUseCase: delete_visit_1.default,
    updateVisitStatusUseCase: update_visit_status_1.default,
    addOrUpdateClientUseCase: add_or_update_client_1.default,
});
exports.default = visitController;
