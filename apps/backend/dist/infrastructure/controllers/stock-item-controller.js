"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_stock_item_1 = __importDefault(require("../../application/use-cases/add-stock-item"));
const get_stock_item_by_id_1 = __importDefault(require("../../application/use-cases/get-stock-item-by-id"));
const find_stock_item_by_name_1 = __importDefault(require("../../application/use-cases/find-stock-item-by-name"));
const get_all_stock_items_1 = __importDefault(require("../../application/use-cases/get-all-stock-items"));
const createStockItemController = (dependencies) => {
    const addStockItemController = async (httpRequest) => {
        const { name, unit, quantity, threshold, isActive } = httpRequest.body;
        const stockItemData = {
            name,
            unit,
            quantity,
            threshold,
            isActive,
        };
        const newStockItem = await dependencies.addStockItemUseCase.execute(stockItemData);
        return {
            statusCode: 201,
            body: newStockItem,
        };
    };
    const getAllStockItemsController = async () => {
        const stockItems = await dependencies.getAllStockItemsUseCase.execute();
        return {
            statusCode: 200,
            body: stockItems,
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
    addStockItemUseCase: add_stock_item_1.default,
    getStockItemByIdUseCase: get_stock_item_by_id_1.default,
    findStockItemByNameUseCase: find_stock_item_by_name_1.default,
    getAllStockItemsUseCase: get_all_stock_items_1.default,
});
exports.default = stockItemController;
