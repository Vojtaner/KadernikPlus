import createStockItemUseCase, {
  CreateStockItemUseCaseType,
} from "../../application/use-cases/create-stock-item";
import { StockItemCreateData } from "@/entities/stock-item";
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import getStockItemByIdUseCase, {
  GetStockItemByIdUseCaseType,
} from "../../application/use-cases/get-stock-item-by-id";
import findStockItemByNameUseCase, {
  FindStockItemByNameUseCaseType,
} from "../../application/use-cases/find-stock-item-by-name";
import getStockItemsByStockIdUseCase, {
  GetStockItemsByStockIdUseCaseType,
} from "../../application/use-cases/get-stock-items-by-stock-id";
import getStocksByUserIdUseCase, {
  GetStocksByUserIdUseCaseType,
} from "../../application/use-cases/get-stocks-by-user-id";

type CreateStockItemControllerType = {
  body: StockItemCreateData;
};
type GetStockItemByIdControllerType = {};
type FindStockItemByNameControllerType = {};
type GetStockItemsByStockIdControllerType = {};
type GetStocksByUserIdControllerType = {};

const createStockItemController = (dependencies: {
  createStockItemUseCase: CreateStockItemUseCaseType;
  getStockItemByIdUseCase: GetStockItemByIdUseCaseType;
  findStockItemByNameUseCase: FindStockItemByNameUseCaseType;
  getStockItemsByStockIdUseCase: GetStockItemsByStockIdUseCaseType;
  getStocksByUserIdUseCase: GetStocksByUserIdUseCaseType;
}) => {
  const createStockItemController: ControllerFunction<
    CreateStockItemControllerType
  > = async (httpRequest) => {
    const { itemName, unit, quantity, threshold, price, stockId } =
      httpRequest.body;

    console.log({ data: httpRequest.body });

    const stockItemData = {
      itemName,
      unit,
      quantity: Number(quantity),
      price: Number(price),
      threshold: Number(threshold),
      stockId,
    };

    const newStockItem = await dependencies.createStockItemUseCase.execute(
      stockItemData
    );

    return {
      statusCode: 201,
      body: newStockItem,
    };
  };
  const getStocksByUserIdController: ControllerFunction<
    CreateStockItemControllerType
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

    const stockItem = await dependencies.getStockItemsByStockIdUseCase.execute(
      stockId
    );

    if (!stockItem) {
      throw new Error(`Stock item with ID "${stockId}" not found.`);
    }

    return {
      statusCode: 200,
      body: stockItem,
    };
  };

  return {
    createStockItemController,
    findStockItemByNameController,
    getStockItemByIdController,
    getStockItemsByStockIdController,
    getStocksByUserIdController,
  };
};

const stockItemController = createStockItemController({
  createStockItemUseCase,
  getStockItemByIdUseCase,
  findStockItemByNameUseCase,
  getStockItemsByStockIdUseCase,
  getStocksByUserIdUseCase,
});
export default stockItemController;
