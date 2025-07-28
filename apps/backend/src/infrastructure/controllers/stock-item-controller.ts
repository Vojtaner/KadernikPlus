import createOrUpdateStockItemUseCase, {
  CreateOrUpdateStockItemUseCaseType,
} from "../../application/use-cases/stock/create-or-update-stock-item";
import { StockItemBuyData, StockItemCreateData } from "@/entities/stock-item";
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import getStockItemByIdUseCase, {
  GetStockItemByIdUseCaseType,
} from "../../application/use-cases/stock/get-stock-item-by-id";
import findStockItemByNameUseCase, {
  FindStockItemByNameUseCaseType,
} from "../../application/use-cases/stock/find-stock-item-by-name";
import getStockItemsByStockIdUseCase, {
  GetStockItemsByStockIdUseCaseType,
} from "../../application/use-cases/stock/get-stock-items-by-stock-id";
import getStocksByUserIdUseCase, {
  GetStocksByUserIdUseCaseType,
} from "../../application/use-cases/stock/get-stocks-by-user-id";

type CreateOrUpdateStockItemControllerType = {
  body: StockItemCreateData | StockItemBuyData;
};
type GetStockItemByIdControllerType = {};
type FindStockItemByNameControllerType = {};
type GetStockItemsByStockIdControllerType = {};
type GetStocksByUserIdControllerType = {};

export const isPurchaseStockItem = (
  data: StockItemCreateData | StockItemBuyData
): data is StockItemBuyData => {
  return "stockItemId" in data;
};

const createStockItemController = (dependencies: {
  createOrUpdateStockItemUseCase: CreateOrUpdateStockItemUseCaseType;
  getStockItemByIdUseCase: GetStockItemByIdUseCaseType;
  findStockItemByNameUseCase: FindStockItemByNameUseCaseType;
  getStockItemsByStockIdUseCase: GetStockItemsByStockIdUseCaseType;
  getStocksByUserIdUseCase: GetStocksByUserIdUseCaseType;
}) => {
  const createOrUpdateStockItemController: ControllerFunction<
    CreateOrUpdateStockItemControllerType
  > = async (httpRequest) => {
    const data = httpRequest.body;

    const newOrUpdatedStockItem =
      await dependencies.createOrUpdateStockItemUseCase.execute(data);

    return {
      statusCode: 201,
      body: newOrUpdatedStockItem,
    };
  };

  const getStocksByUserIdController: ControllerFunction<
    GetStocksByUserIdControllerType
  > = async (httpRequest) => {
    const userId = httpRequest.userId;
    const stocks = await dependencies.getStocksByUserIdUseCase.execute(userId);

    return {
      statusCode: 200,
      body: stocks,
    };
  };

  const findStockItemByNameController: ControllerFunction<
    FindStockItemByNameControllerType
  > = async (httpRequest) => {
    const { name } = httpRequest.query;

    if (typeof name !== "string" || !name.trim()) {
      throw new Error(
        "Name query parameter is required and must be a non-empty string."
      );
    }

    const stockItem = await dependencies.findStockItemByNameUseCase.execute(
      name
    );

    if (!stockItem) {
      throw new Error(`Stock item with name "${name}" not found.`);
    }

    return {
      statusCode: 200, // OK
      body: stockItem,
    };
  };

  const getStockItemByIdController: ControllerFunction<
    GetStockItemByIdControllerType
  > = async (httpRequest) => {
    const { stockItemId } = httpRequest.params;
    const stockItem = await dependencies.getStockItemByIdUseCase.execute(
      stockItemId
    );

    if (!stockItem) {
      throw new Error(`Stock item with ID "${stockItemId}" not found.`);
    }

    return {
      statusCode: 200,
      body: stockItem,
    };
  };
  const getStockItemsByStockIdController: ControllerFunction<
    GetStockItemsByStockIdControllerType
  > = async (httpRequest) => {
    const { stockId } = httpRequest.params;

    const stockItems = await dependencies.getStockItemsByStockIdUseCase.execute(
      stockId
    );

    if (!stockItems) {
      throw new Error(`Stock item with ID "${stockId}" not found.`);
    }

    return {
      statusCode: 200,
      body: stockItems,
    };
  };

  return {
    createOrUpdateStockItemController,
    findStockItemByNameController,
    getStockItemByIdController,
    getStockItemsByStockIdController,
    getStocksByUserIdController,
  };
};

const stockItemController = createStockItemController({
  createOrUpdateStockItemUseCase,
  getStockItemByIdUseCase,
  findStockItemByNameUseCase,
  getStockItemsByStockIdUseCase,
  getStocksByUserIdUseCase,
});
export default stockItemController;
