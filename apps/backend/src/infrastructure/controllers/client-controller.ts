import { HasId } from "@/domain/entity";
import addClientUseCase, {
  CreateAddClientUseCaseType,
} from "../../application/use-cases/add-client";
import getClientByIdUseCase, {
  CreateGetClientByIdUseCaseType,
} from "../../application/use-cases/get-client-by-id";
import { ControllerFunction } from "../../utils/make-express-callback";
import { Client, ClientCreateData } from "@/entities/client";

type GetClientByIdControllerType = { params: HasId };
type AddClientControllerType = {};
const createClientController = (dependencies: {
  addClientUseCase: CreateAddClientUseCaseType;
  getClientByIdUseCase: CreateGetClientByIdUseCaseType;
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

  return { addClientController, getClientByIdController };
};

const clientController = createClientController({
  addClientUseCase,
  getClientByIdUseCase,
});

export default clientController;
