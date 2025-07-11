"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_visit_1 = require("../../application/use-cases/add-visit");
const get_visits_1 = __importDefault(require("../../application/use-cases/get-visits"));
const find_visit_by_id_1 = __importDefault(require("../../application/use-cases/find-visit-by-id"));
// /**
//  * Interface defining the dependencies for the VisitController.
//  * This allows for easy dependency injection and testing.
//  */
// interface VisitControllerDependencies {
//   addVisit: AddVisit;
//   getVisits: GetVisits;
//   // Add other visit-related use cases here as they are created
// }
// /**
//  * VisitController handles HTTP requests related to Visit entities.
//  * It translates HTTP requests into calls to application layer use cases
//  * and translates use case results back into HTTP responses.
//  */
// export class VisitController {
//   private readonly addVisitUseCase: AddVisit;
//   private readonly getVisitsUseCase: GetVisits;
//   constructor(dependencies: VisitControllerDependencies) {
//     this.addVisitUseCase = dependencies.addVisit;
//     this.getVisitsUseCase = dependencies.getVisits;
//   }
//   /**
//    * Handles the HTTP POST request to create a new visit.
//    * Expects visit data in the request body.
//    */
//   addVisitController: ControllerFunction = async (httpRequest) => {
//     try {
//       const visitData: VisitCreateData = httpRequest.body;
//       // Basic input validation: ensure required fields are provided
//       if (
//         !visitData.clientId ||
//         !visitData.userId ||
//         !visitData.date ||
//         visitData.paidPrice === undefined
//       ) {
//         return {
//           statusCode: 400,
//           body: {
//             error:
//               "Missing required visit fields: clientId, userId, date, paidPrice.",
//           },
//         };
//       }
//       // Convert date string to Date object if needed (assuming date comes as ISO string)
//       // If your frontend sends dates as ISO strings, you'd parse them here.
//       if (typeof visitData.date === "string") {
//         visitData.date = new Date(visitData.date);
//       }
//       if (isNaN(visitData.date.getTime())) {
//         // Check if date is valid
//         return {
//           statusCode: 400,
//           body: { error: "Invalid date format for visit date." },
//         };
//       }
//       // Call the AddVisit use case (application layer)
//       const newVisit = await this.addVisitUseCase.execute(visitData);
//       return {
//         statusCode: 201, // 201 Created
//         body: newVisit,
//       };
//     } catch (error: any) {
//       // Handle specific application-level errors
//       if (
//         error.name === "UserNotFoundError" ||
//         error.name === "ClientNotFoundError"
//       ) {
//         return {
//           statusCode: 400, // Bad Request, as associated entity doesn't exist
//           body: { error: error.message },
//         };
//       }
//       // Re-throw or handle other unexpected errors
//       console.error("Error in addVisitController:", error);
//       throw error; // Let makeExpressCallback handle the generic 500 error
//     }
//   };
//   /**
//    * Handles the HTTP GET request to retrieve visits.
//    * Can accept an optional `clientId` query parameter to filter visits.
//    */
//   getVisitsController: ControllerFunction = async (httpRequest) => {
//     try {
//       // Get optional clientId from query parameters
//       const clientId = httpRequest.query.clientId as string | undefined;
//       // Call the GetVisits use case (application layer)
//       const visits = await this.getVisitsUseCase.execute(clientId);
//       return {
//         statusCode: 200, // OK
//         body: visits,
//       };
//     } catch (error: any) {
//       // Handle specific application-level errors
//       if (error.name === "ClientNotFoundError") {
//         return {
//           statusCode: 400, // Bad Request, as the filtered client doesn't exist
//           body: { error: error.message },
//         };
//       }
//       // Re-throw or handle other unexpected errors
//       console.error("Error in getVisitsController:", error);
//       throw error; // Let makeExpressCallback handle the generic 500 error
//     }
//   };
// }
// src/controllers/visit-controller.ts
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
