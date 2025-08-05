"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewStockItem = exports.isPurchaseStockItem = void 0;
const create_or_update_stock_item_1 = __importDefault(require("../../application/use-cases/stock/create-or-update-stock-item"));
const get_stock_item_by_id_1 = __importDefault(require("../../application/use-cases/stock/get-stock-item-by-id"));
const find_stock_item_by_name_1 = __importDefault(require("../../application/use-cases/stock/find-stock-item-by-name"));
const get_stock_items_by_stock_id_1 = __importDefault(require("../../application/use-cases/stock/get-stock-items-by-stock-id"));
const get_stocks_by_user_id_1 = __importDefault(require("../../application/use-cases/stock/get-stocks-by-user-id"));
const delete_stock_item_by_id_1 = __importDefault(require("../../application/use-cases/stock/delete-stock-item-by-id"));
const isPurchaseStockItem = (data) => {
    return (Object.keys(data).length === 3 &&
        "id" in data &&
        "quantity" in data &&
        "price" in data);
};
exports.isPurchaseStockItem = isPurchaseStockItem;
const isNewStockItem = (data) => {
    return !("stockItemId" in data) && "threshold" in data;
};
exports.isNewStockItem = isNewStockItem;
const createStockItemController = (dependencies) => {
    const createOrUpdateStockItemController = async (httpRequest) => {
        const data = httpRequest.body;
        const newOrUpdatedStockItem = await dependencies.createOrUpdateStockItemUseCase.execute(data);
        return {
            statusCode: 201,
            body: newOrUpdatedStockItem,
        };
    };
    const getStocksByUserIdController = async (httpRequest) => {
        const userId = httpRequest.userId;
        const stocks = await dependencies.getStocksByUserIdUseCase.execute(userId);
        return {
            statusCode: 200,
            body: stocks,
        };
    };
    const findStockItemByNameController = async (httpRequest) => {
        const { name } = httpRequest.query;
        if (typeof name !== "string" || !name.trim()) {
            throw new Error("Name query parameter is required and must be a non-empty string.");
        }
        const stockItem = await dependencies.findStockItemByNameUseCase.execute(name);
        if (!stockItem) {
            throw new Error(`Stock item with name "${name}" not found.`);
        }
        return {
            statusCode: 200, // OK
            body: stockItem,
        };
    };
    const getStockItemByIdController = async (httpRequest) => {
        const { stockItemId } = httpRequest.params;
        const userId = httpRequest.userId;
        const stockItem = await dependencies.getStockItemByIdUseCase.execute(stockItemId, userId);
        if (!stockItem) {
            throw new Error(`Stock item with ID "${stockItemId}" not found.`);
        }
        return {
            statusCode: 200,
            body: stockItem,
        };
    };
    const deleteStockItemByIdController = async (httpRequest) => {
        console.log({ httpRequest: httpRequest.params });
        const { stockItemId } = httpRequest.params;
        const userId = httpRequest.userId;
        await dependencies.deleteStockItemByIdUseCase.execute(stockItemId, userId);
        return {
            statusCode: 204,
        };
    };
    const getStockItemsByStockIdController = async (httpRequest) => {
        const { stockId } = httpRequest.params;
        const userId = httpRequest.userId;
        const stockItems = await dependencies.getStockItemsByStockIdUseCase.execute(stockId, userId);
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
        deleteStockItemByIdController,
    };
};
const stockItemController = createStockItemController({
    createOrUpdateStockItemUseCase: create_or_update_stock_item_1.default,
    getStockItemByIdUseCase: get_stock_item_by_id_1.default,
    findStockItemByNameUseCase: find_stock_item_by_name_1.default,
    getStockItemsByStockIdUseCase: get_stock_items_by_stock_id_1.default,
    getStocksByUserIdUseCase: get_stocks_by_user_id_1.default,
    deleteStockItemByIdUseCase: delete_stock_item_by_id_1.default,
});
exports.default = stockItemController;
