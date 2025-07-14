import addStockItemUseCase, {
  AddStockItemUseCaseType,
} from "../../application/use-cases/add-stock-item";
import { StockItemCreateData } from "@/entities/stock-item";
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import { HasId } from "@/domain/entity";
import getStockItemByIdUseCase, {
  GetStockItemByIdUseCaseType,
} from "../../application/use-cases/get-stock-item-by-id";
import findStockItemByNameUseCase, {
  FindStockItemByNameUseCaseType,
} from "../../application/use-cases/find-stock-item-by-name";
import getAllStockItemsUseCase, {
  GetAllStockItemsUseCaseType,
} from "../../application/use-cases/get-all-stock-items";

type AddStockItemControllerType = { body: StockItemCreateData };
type GetStockItemByIdControllerType = { params: HasId };
type FindStockItemByNameControllerType = {};
type GetAllStockItemsControllerType = {};

const createStockItemController = (dependencies: {
  addStockItemUseCase: AddStockItemUseCaseType;
  getStockItemByIdUseCase: GetStockItemByIdUseCaseType;
  findStockItemByNameUseCase: FindStockItemByNameUseCaseType;
  getAllStockItemsUseCase: GetAllStockItemsUseCaseType;
}) => {
  const addStockItemController: ControllerFunction<
    AddStockItemControllerType
  > = async (httpRequest) => {
    const { name, unit, quantity, threshold, isActive } = httpRequest.body;

    const stockItemData = {
      name,
      unit,
      quantity,
      threshold,
      isActive,
    };

    const newStockItem = await dependencies.addStockItemUseCase.execute(
      stockItemData
    );

    return {
      statusCode: 201,
      body: newStockItem,
    };
  };
  const getAllStockItemsController: ControllerFunction<
    GetAllStockItemsControllerType
  > = async () => {
    const stockItems = await dependencies.getAllStockItemsUseCase.execute();

    return {
      statusCode: 200,
      body: stockItems,
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
    const { id } = httpRequest.params;

    const stockItem = await dependencies.getStockItemByIdUseCase.execute(id);

    if (!stockItem) {
      throw new Error(`Stock item with ID "${id}" not found.`);
    }

    return {
      statusCode: 200,
      body: stockItem,
    };
  };

  return {
    addStockItemController,
    getAllStockItemsController,
    findStockItemByNameController,
    getStockItemByIdController,
  };
};

const stockItemController = createStockItemController({
  addStockItemUseCase,
  getStockItemByIdUseCase,
  findStockItemByNameUseCase,
  getAllStockItemsUseCase,
});
export default stockItemController;
