import { AddClient } from "@/application/use-cases/add-client";
import { GetClientById } from "@/application/use-cases/get-client-by-id";
import { ClientCreateData } from "@/entities/client";
import { ControllerFunction } from "../../utils/make-express-callback";

/**
 * Interface defining the dependencies for the ClientController.
 * This allows for easy dependency injection and testing.
 */
interface ClientControllerDependencies {
  addClient: AddClient;
  getClientById: GetClientById;
  // Add other client-related use cases here as they are created
  // getAllClients: GetAllClients;
}

/**
 * ClientController handles HTTP requests related to Client entities.
 * It translates HTTP requests into calls to application layer use cases
 * and translates use case results back into HTTP responses.
 */
export class ClientController {
  private readonly addClientUseCase: AddClient;
  private readonly getClientByIdUseCase: GetClientById;

  constructor(dependencies: ClientControllerDependencies) {
    this.addClientUseCase = dependencies.addClient;
    this.getClientByIdUseCase = dependencies.getClientById;
  }

  /**
   * Handles the HTTP POST request to create a new client.
   * Expects client data in the request body.
   */
  addClientController: ControllerFunction = async (httpRequest) => {
    try {
      const clientData: ClientCreateData = httpRequest.body;

      // Basic input validation: ensure at least a name is provided
      if (!clientData.name) {
        return {
          statusCode: 400,
          body: { error: "Missing required client field: name." },
        };
      }

      // Call the AddClient use case (application layer)
      const newClient = await this.addClientUseCase.execute(clientData);

      return {
        statusCode: 201, // 201 Created
        body: newClient,
      };
    } catch (error: any) {
      // Handle specific application-level errors
      if (error.name === "ClientAlreadyExistsError") {
        return {
          statusCode: 409, // Conflict
          body: { error: error.message },
        };
      }
      // Re-throw or handle other unexpected errors
      console.error("Error in addClientController:", error);
      throw error; // Let makeExpressCallback handle the generic 500 error
    }
  };

  /**
   * Handles the HTTP GET request to retrieve a client by ID.
   * Expects the client ID in the request parameters.
   */
  getClientByIdController: ControllerFunction = async (httpRequest) => {
    try {
      const { id } = httpRequest.params; // Get ID from URL parameters

      if (!id) {
        return {
          statusCode: 400,
          body: { error: "Missing client ID in parameters." },
        };
      }

      // Call the GetClientById use case (application layer)
      const client = await this.getClientByIdUseCase.execute(id);

      return {
        statusCode: 200, // OK
        body: client,
      };
    } catch (error: any) {
      // Handle specific application-level errors
      if (error.name === "ClientNotFoundError") {
        return {
          statusCode: 404, // Not Found
          body: { error: error.message },
        };
      }
      // Re-throw or handle other unexpected errors
      console.error("Error in getClientByIdController:", error);
      throw error; // Let makeExpressCallback handle the generic 500 error
    }
  };

  // You can add more controller methods here for other client-related operations
  // e.g., getAllClientsController, updateClientController, deleteClientController
}
