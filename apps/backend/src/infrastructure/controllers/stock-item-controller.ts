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
import deleteStockItemByIdUseCase, {
  DeleteStockItemByIdUseCaseType,
} from "../../application/use-cases/stock/delete-stock-item-by-id";
import getStockItemsByStocksIdUseCase, {
  GetStockItemsByStocksIdUseCaseType,
} from "../../application/use-cases/stock/get-stock-items-by-user-id";
import getStocksByUserIdUseCase, {
  GetStocksByUserIdUseCaseType,
} from "../../application/use-cases/stock/get-stocks-by-user-id";

type CreateOrUpdateStockItemControllerType = {
  body: StockItemCreateData | StockItemBuyData;
};
type GetStockItemByIdControllerType = {};
type DeleteStockItemByIdControllerType = { params: { stockItemId: string } };
type FindStockItemByNameControllerType = {};
type GetStockItemsByStockIdUserIdControllerType = {
  query: { stockId: string };
};
type GetStocksByUserIdControllerType = {};

export const isPurchaseStockItem = (
  data: StockItemCreateData | StockItemBuyData
): data is StockItemBuyData => {
  return (
    Object.keys(data).length === 5 &&
    "id" in data &&
    "quantity" in data &&
    "totalPrice" in data &&
    "packageCount" in data &&
    "stockId" in data
  );
};

export const isNewStockItem = (
  data: StockItemCreateData | StockItemBuyData
): data is StockItemCreateData => {
  return !("stockItemId" in data) && "threshold" in data;
};

const createStockItemController = (dependencies: {
  createOrUpdateStockItemUseCase: CreateOrUpdateStockItemUseCaseType;
  getStockItemByIdUseCase: GetStockItemByIdUseCaseType;
  findStockItemByNameUseCase: FindStockItemByNameUseCaseType;
  getStockItemsByStockIdUseCase: GetStockItemsByStockIdUseCaseType;
  getStockItemsByStocksIdUseCase: GetStockItemsByStocksIdUseCaseType;
  deleteStockItemByIdUseCase: DeleteStockItemByIdUseCaseType;
  getStocksByUserIdUseCase: GetStocksByUserIdUseCaseType;
}) => {
  const createOrUpdateStockItemController: ControllerFunction<
    CreateOrUpdateStockItemControllerType
  > = async (httpRequest) => {
    const data = httpRequest.body;
    const userId = httpRequest.userId;

    const newOrUpdatedStockItem =
      await dependencies.createOrUpdateStockItemUseCase.execute(data, userId);

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
    const userId = httpRequest.userId;

    const stockItem = await dependencies.getStockItemByIdUseCase.execute(
      stockItemId,
      userId
    );

    if (!stockItem) {
      throw new Error(`Stock item with ID "${stockItemId}" not found.`);
    }

    return {
      statusCode: 200,
      body: stockItem,
    };
  };
  const deleteStockItemByIdController: ControllerFunction<
    DeleteStockItemByIdControllerType
  > = async (httpRequest) => {
    const { stockItemId } = httpRequest.params;
    const userId = httpRequest.userId;

    await dependencies.deleteStockItemByIdUseCase.execute(stockItemId, userId);

    return {
      statusCode: 204,
    };
  };
  const getStockItemsByStockIdOrUserIdController: ControllerFunction<
    GetStockItemsByStockIdUserIdControllerType
  > = async (httpRequest) => {
    const { stockId } = httpRequest.query;
    const userId = httpRequest.userId;

    const stockItemsByStocks =
      await dependencies.getStockItemsByStocksIdUseCase.execute(
        userId,
        stockId
      );

    return {
      statusCode: 200,
      body: stockItemsByStocks,
    };
  };

  return {
    createOrUpdateStockItemController,
    findStockItemByNameController,
    getStockItemByIdController,
    getStockItemsByStockIdOrUserIdController,
    getStocksByUserIdController,
    deleteStockItemByIdController,
  };
};

const stockItemController = createStockItemController({
  createOrUpdateStockItemUseCase,
  getStockItemByIdUseCase,
  findStockItemByNameUseCase,
  getStockItemsByStockIdUseCase,
  getStockItemsByStocksIdUseCase,
  deleteStockItemByIdUseCase,
  getStocksByUserIdUseCase,
});
export default stockItemController;
