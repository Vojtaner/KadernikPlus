"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_visit_1 = require("../../application/use-cases/add-visit");
const get_visits_1 = __importDefault(require("../../application/use-cases/get-visits"));
const find_visit_by_id_1 = __importDefault(require("../../application/use-cases/find-visit-by-id"));
const createVisitController = (dependencies) => {
    const addVisitController = async (httpRequest) => {
        try {
            const visitData = httpRequest.body;
            if (!visitData.clientId ||
                !visitData.userId ||
                !visitData.date ||
                visitData.paidPrice === undefined) {
                return {
                    statusCode: 400,
                    body: {
                        error: "Missing required visit fields: clientId, userId, date, paidPrice.",
                    },
                };
            }
            if (typeof visitData.date === "string") {
                visitData.date = new Date(visitData.date);
            }
            if (isNaN(visitData.date.getTime())) {
                return {
                    statusCode: 400,
                    body: { error: "Invalid date format for visit date." },
                };
            }
            const newVisit = await dependencies.addVisitUseCase.execute(visitData);
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
    const getVisitsController = async (httpRequest) => {
        try {
            const clientId = httpRequest.query.clientId;
            const visits = await dependencies.getVisitsUseCase.execute(clientId);
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
    const findVisitByIdController = async (httpRequest) => {
        try {
            const id = httpRequest.query.id;
            const visit = await dependencies.findVisitByIdUseCase.execute(id);
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
    return {
        addVisitController,
        getVisitsController,
        findVisitByIdController,
    };
};
const visitController = createVisitController({
    addVisitUseCase: add_visit_1.addVisitUseCase,
    getVisitsUseCase: get_visits_1.default,
    findVisitByIdUseCase: find_visit_by_id_1.default,
});
exports.default = visitController;
