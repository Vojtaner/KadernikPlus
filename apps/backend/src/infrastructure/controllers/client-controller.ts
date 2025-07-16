import { HasId } from "@/domain/entity";
import addClientUseCase, {
  CreateAddClientUseCaseType,
} from "../../application/use-cases/add-client";
import getClientByIdUseCase, {
  CreateGetClientByIdUseCaseType,
} from "../../application/use-cases/get-client-by-id";
import { ControllerFunction } from "../../adapters/express/make-express-callback";
import { Client, ClientCreateData } from "@/entities/client";
import getAllClientsByUserIdUseCase, {
  GetAllClientsByUserIdUseCaseType,
} from "../../application/use-cases/get-all-clients";

type GetClientByIdControllerType = { params: HasId };
type AddClientControllerType = {};
const createClientController = (dependencies: {
  addClientUseCase: CreateAddClientUseCaseType;
  getClientByIdUseCase: CreateGetClientByIdUseCaseType;
  getAllClientsByUserIdUseCase: GetAllClientsByUserIdUseCaseType;
}) => {
  const addClientController: ControllerFunction<
    AddClientControllerType
  > = async (httpRequest) => {
    try {
      const clientData: ClientCreateData = httpRequest.body;
      const userId = httpRequest.userId;

      const clientDataWithUserId = { ...clientData, userId };

      const client =
        dependencies.addClientUseCase.execute(clientDataWithUserId);

      return {
        statusCode: 201,
        body: client,
      };
    } catch (error: any) {
      //například
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
      const id = httpRequest.params.id;

      const client = await dependencies.getClientByIdUseCase.execute(id);

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
    addClientController,
    getClientByIdController,
    getAllClientsByUserIdController,
  };
};

const clientController = createClientController({
  addClientUseCase,
  getClientByIdUseCase,
  getAllClientsByUserIdUseCase,
});

export default clientController;
