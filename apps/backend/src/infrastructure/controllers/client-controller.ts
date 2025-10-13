import addOrUpdateClientUseCase, {
  CreateAddOrUpdateClientUseCaseType,
} from "../../application/use-cases/clients/add-or-update-client";
import getClientByIdUseCase, {
  CreateGetClientByIdUseCaseType,
} from "../../application/use-cases/clients/get-client-by-id";
import { ControllerFunction } from "../../adapters/express/make-express-callback";
import { ClientOrUpdateCreateData } from "../../entities/client";
import getAllClientsByUserIdUseCase, {
  GetAllClientsByUserIdUseCaseType,
} from "../../application/use-cases/clients/get-all-clients";
import searchClientsUseCase, {
  SearchClientsUseCaseType,
} from "../../application/use-cases/clients/search-client";
import importClientsUseCase, {
  CreateImportClientsUseCaseType,
} from "../../application/use-cases/clients/import-clients";

type GetClientByIdControllerType = { params: { clientId: string } };
type ImportClientsControllerType = {
  body: { contacts: { firstName: string; lastName: string; phone: string }[] };
};
type AddClientControllerType = {};
const createClientController = (dependencies: {
  addOrUpdateClientUseCase: CreateAddOrUpdateClientUseCaseType;
  importClientsUseCase: CreateImportClientsUseCaseType;
  getClientByIdUseCase: CreateGetClientByIdUseCaseType;
  getAllClientsByUserIdUseCase: GetAllClientsByUserIdUseCaseType;
  searchClientsUseCase: SearchClientsUseCaseType;
}) => {
  const findClientsController: ControllerFunction<{
    query: { query: string };
  }> = async (httpRequest) => {
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
  };

  const addOrUpdateClientController: ControllerFunction<
    AddClientControllerType
  > = async (httpRequest) => {
    const clientData: ClientOrUpdateCreateData = httpRequest.body;
    const userId = httpRequest.userId;

    const clientDataWithUserId = { ...clientData, userId };

    const newOrUpdatedClient =
      await dependencies.addOrUpdateClientUseCase.execute(clientDataWithUserId);
    return {
      statusCode: 201,
      body: newOrUpdatedClient,
    };
  };

  const importClientsController: ControllerFunction<
    ImportClientsControllerType
  > = async (httpRequest) => {
    const { contacts } = httpRequest.body;
    const userId = httpRequest.userId;

    const newOrUpdatedClient = await dependencies.importClientsUseCase.execute({
      clientImport: contacts,
      userId,
    });
    return {
      statusCode: 201,
      body: newOrUpdatedClient,
    };
  };

  const getAllClientsByUserIdController: ControllerFunction<
    GetClientByIdControllerType
  > = async (httpRequest) => {
    const userId = httpRequest.userId;

    const clients = await dependencies.getAllClientsByUserIdUseCase.execute(
      userId
    );

    return {
      statusCode: 201,
      body: clients,
    };
  };

  const getClientByIdController: ControllerFunction<
    GetClientByIdControllerType
  > = async (httpRequest) => {
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
  };

  return {
    addOrUpdateClientController,
    importClientsController,
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
  importClientsUseCase,
});

export default clientController;
