import { Request, Response, Router } from "express"; // Router is still needed for the class, but Request/Response types are less direct
import { AddStockItemUseCase } from "../../application/use-cases/add-stock-item";
import { GetStockItemByIdUseCase } from "../../application/use-cases/get-stock-item-by-id";
import { FindStockItemByNameUseCase } from "../../application/use-cases/find-stock-item-by-name";
import { GetAllStockItemsUseCase } from "../../application/use-cases/get-all-stock-items";
import { StockItemCreateData } from "@/entities/stock-item";
import { ControllerFunction } from "@/utils/make-express-callback";

/**
 * Interface defining the dependencies for the StockItemController.
 * This allows for easy dependency injection and testing.
 */
interface StockItemControllerDependencies {
  addStockItemUseCase: AddStockItemUseCase;
  getStockItemByIdUseCase: GetStockItemByIdUseCase;
  findStockItemByNameUseCase: FindStockItemByNameUseCase;
  getAllStockItemsUseCase: GetAllStockItemsUseCase;
}

/**
 * Handles HTTP requests related to StockItem entities.
 * It translates HTTP requests into calls to application layer use cases
 * and translates use case results back into HTTP responses.
 */
export class StockItemController {
  // We declare router here, but its routes will be set up externally using makeExpressCallback
  public router: Router;
  private readonly addStockItemUseCase: AddStockItemUseCase;
  private readonly getStockItemByIdUseCase: GetStockItemByIdUseCase;
  private readonly findStockItemByNameUseCase: FindStockItemByNameUseCase;
  private readonly getAllStockItemsUseCase: GetAllStockItemsUseCase;

  constructor(dependencies: StockItemControllerDependencies) {
    this.addStockItemUseCase = dependencies.addStockItemUseCase;
    this.getStockItemByIdUseCase = dependencies.getStockItemByIdUseCase;
    this.findStockItemByNameUseCase = dependencies.findStockItemByNameUseCase;
    this.getAllStockItemsUseCase = dependencies.getAllStockItemsUseCase;
    this.router = Router(); // Initialize router here, but routes are defined in app.ts
  }

  /**
   * Handles the HTTP POST request to create a new stock item.
   * Expects stock item data in the request body.
   */
  addStockItemController: ControllerFunction = async (httpRequest) => {
    const { name, unit, quantity, threshold, isActive } = httpRequest.body;
    const stockItemData: StockItemCreateData = {
      name,
      unit,
      quantity,
      threshold,
      isActive,
    };

    // The use case will throw errors if validation fails or if a unique name conflict occurs.
    // makeExpressCallback will catch these errors and format the response.
    const newStockItem = await this.addStockItemUseCase.execute(stockItemData);

    return {
      statusCode: 201, // 201 Created
      body: newStockItem,
    };
  };

  /**
   * Handles the HTTP GET request to retrieve a stock item by ID.
   * Expects the stock item ID in the request parameters.
   */
  getStockItemByIdController: ControllerFunction = async (httpRequest) => {
    const { id } = httpRequest.params;

    // The use case will throw an error if the ID is empty.
    const stockItem = await this.getStockItemByIdUseCase.execute(id);

    if (!stockItem) {
      // Throw an error if not found, which makeExpressCallback will catch and map to 404
      throw new Error(`Stock item with ID "${id}" not found.`);
    }

    return {
      statusCode: 200, // OK
      body: stockItem,
    };
  };

  /**
   * Handles the HTTP GET request to find a stock item by name.
   * Expects the stock item name in the query parameters.
   */
  findStockItemByNameController: ControllerFunction = async (httpRequest) => {
    const { name } = httpRequest.query;

    // Controller-level validation for query parameter type and presence
    if (typeof name !== "string" || !name.trim()) {
      throw new Error(
        "Name query parameter is required and must be a non-empty string."
      );
    }

    // The use case will throw an error if the name is empty (though handled above too)
    const stockItem = await this.findStockItemByNameUseCase.execute(name);

    if (!stockItem) {
      // Throw an error if not found, which makeExpressCallback will catch and map to 404
      throw new Error(`Stock item with name "${name}" not found.`);
    }

    return {
      statusCode: 200, // OK
      body: stockItem,
    };
  };

  /**
   * Handles the HTTP GET request to retrieve all stock items.
   */
  getAllStockItemsController: ControllerFunction = async (httpRequest) => {
    // No specific input validation needed here for this use case
    const stockItems = await this.getAllStockItemsUseCase.execute();

    return {
      statusCode: 200, // OK
      body: stockItems,
    };
  };
}
