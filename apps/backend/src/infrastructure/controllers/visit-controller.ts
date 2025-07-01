import { AddVisit } from "@/application/use-cases/add-visit";
import { GetVisits } from "@/application/use-cases/get-visits";
import { VisitCreateData } from "@/domain/entities/visit";
import { ControllerFunction } from "@/utils/make-express-callback";

/**
 * Interface defining the dependencies for the VisitController.
 * This allows for easy dependency injection and testing.
 */
interface VisitControllerDependencies {
  addVisit: AddVisit;
  getVisits: GetVisits;
  // Add other visit-related use cases here as they are created
}

/**
 * VisitController handles HTTP requests related to Visit entities.
 * It translates HTTP requests into calls to application layer use cases
 * and translates use case results back into HTTP responses.
 */
export class VisitController {
  private readonly addVisitUseCase: AddVisit;
  private readonly getVisitsUseCase: GetVisits;

  constructor(dependencies: VisitControllerDependencies) {
    this.addVisitUseCase = dependencies.addVisit;
    this.getVisitsUseCase = dependencies.getVisits;
  }

  /**
   * Handles the HTTP POST request to create a new visit.
   * Expects visit data in the request body.
   */
  addVisitController: ControllerFunction = async (httpRequest) => {
    try {
      const visitData: VisitCreateData = httpRequest.body;

      // Basic input validation: ensure required fields are provided
      if (
        !visitData.clientId ||
        !visitData.userId ||
        !visitData.date ||
        visitData.paidPrice === undefined
      ) {
        return {
          statusCode: 400,
          body: {
            error:
              "Missing required visit fields: clientId, userId, date, paidPrice.",
          },
        };
      }

      // Convert date string to Date object if needed (assuming date comes as ISO string)
      // If your frontend sends dates as ISO strings, you'd parse them here.
      if (typeof visitData.date === "string") {
        visitData.date = new Date(visitData.date);
      }
      if (isNaN(visitData.date.getTime())) {
        // Check if date is valid
        return {
          statusCode: 400,
          body: { error: "Invalid date format for visit date." },
        };
      }

      // Call the AddVisit use case (application layer)
      const newVisit = await this.addVisitUseCase.execute(visitData);

      return {
        statusCode: 201, // 201 Created
        body: newVisit,
      };
    } catch (error: any) {
      // Handle specific application-level errors
      if (
        error.name === "UserNotFoundError" ||
        error.name === "ClientNotFoundError"
      ) {
        return {
          statusCode: 400, // Bad Request, as associated entity doesn't exist
          body: { error: error.message },
        };
      }
      // Re-throw or handle other unexpected errors
      console.error("Error in addVisitController:", error);
      throw error; // Let makeExpressCallback handle the generic 500 error
    }
  };

  /**
   * Handles the HTTP GET request to retrieve visits.
   * Can accept an optional `clientId` query parameter to filter visits.
   */
  getVisitsController: ControllerFunction = async (httpRequest) => {
    try {
      // Get optional clientId from query parameters
      const clientId = httpRequest.query.clientId as string | undefined;

      // Call the GetVisits use case (application layer)
      const visits = await this.getVisitsUseCase.execute(clientId);

      return {
        statusCode: 200, // OK
        body: visits,
      };
    } catch (error: any) {
      // Handle specific application-level errors
      if (error.name === "ClientNotFoundError") {
        return {
          statusCode: 400, // Bad Request, as the filtered client doesn't exist
          body: { error: error.message },
        };
      }
      // Re-throw or handle other unexpected errors
      console.error("Error in getVisitsController:", error);
      throw error; // Let makeExpressCallback handle the generic 500 error
    }
  };
}
