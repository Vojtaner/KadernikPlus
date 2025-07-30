import addOrUpdateClientUseCase, {
  CreateAddOrUpdateClientUseCaseType,
} from "../../application/use-cases/clients/add-or-update-client";
import getClientByIdUseCase, {
  CreateGetClientByIdUseCaseType,
} from "../../application/use-cases/clients/get-client-by-id";
import { ControllerFunction } from "../../adapters/express/make-express-callback";
import { ClientOrUpdateCreateData } from "../../../../entities/client";
import getAllClientsByUserIdUseCase, {
  GetAllClientsByUserIdUseCaseType,
} from "../../application/use-cases/clients/get-all-clients";
import searchClientsUseCase, {
  SearchClientsUseCaseType,
} from "../../application/use-cases/clients/search-client";

type GetClientByIdControllerType = { params: { clientId: string } };
type AddClientControllerType = {};
const createClientController = (dependencies: {
  addOrUpdateClientUseCase: CreateAddOrUpdateClientUseCaseType;
  getClientByIdUseCase: CreateGetClientByIdUseCaseType;
  getAllClientsByUserIdUseCase: GetAllClientsByUserIdUseCaseType;
  searchClientsUseCase: SearchClientsUseCaseType;
}) => {
  const findClientsController: ControllerFunction<{
    query: { query: string };
  }> = async (httpRequest) => {
    try {
      const { query } = httpRequest.query;
      const userId = httpRequest.userId;

      const clients = await dependencies.searchClientsUseCase.execute(
        userId,
        query
      );

      return {
        statusCode: 200,
        body: clients,
      };
    } catch (error: any) {
      console.error("Error in findClientsController:", error);
      return {
        statusCode: 500,
        body: { error: "Internal Server Error" },
      };
    }
  };

  const addOrUpdateClientController: ControllerFunction<
    AddClientControllerType
  > = async (httpRequest) => {
    try {
      const clientData: ClientOrUpdateCreateData = httpRequest.body;
      const userId = httpRequest.userId;

      const clientDataWithUserId = { ...clientData, userId };

      const newOrUpdatedClient =
        await dependencies.addOrUpdateClientUseCase.execute(
          clientDataWithUserId
        );

      return {
        statusCode: 201,
        body: newOrUpdatedClient,
      };
    } catch (error: any) {
      if (
        error.name === "UserNotFoundError" ||
        error.name === "ClientNotFoundError"
      ) {
        return {
          statusCode: 400,
          body: { error: error.message },
        };
      }

      console.error("Error in addClientController:", error);
      throw error;
    }
  };

  const getAllClientsByUserIdController: ControllerFunction<
    GetClientByIdControllerType
  > = async (httpRequest) => {
    try {
      const userId = httpRequest.userId;

      const clients = await dependencies.getAllClientsByUserIdUseCase.execute(
        userId
      );

      return {
        statusCode: 201,
        body: clients,
      };
    } catch (error: any) {
      if (
        error.name === "UserNotFoundError" ||
        error.name === "ClientNotFoundError"
      ) {
        return {
          statusCode: 400,
          body: { error: error.message },
        };
      }

      console.error("Error in getAllClientsController:", error);
      throw error;
    }
  };
  const getClientByIdController: ControllerFunction<
    GetClientByIdControllerType
  > = async (httpRequest) => {
    try {
      const clientId = httpRequest.params.clientId;
      const userId = httpRequest.userId;

      const client = await dependencies.getClientByIdUseCase.execute(
        clientId,
        userId
      );

      return {
        statusCode: 201,
        body: client,
      };
    } catch (error: any) {
      if (
        error.name === "UserNotFoundError" ||
        error.name === "ClientNotFoundError"
      ) {
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
  addOrUpdateClientUseCase,
  getClientByIdUseCase,
  getAllClientsByUserIdUseCase,
  searchClientsUseCase,
});

export default clientController;
