"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStockItemByIdUseCase = void 0;
/**
 * Represents the use case for retrieving a single stock item by its ID.
 */
class GetStockItemByIdUseCase {
    constructor(stockItemRepository) {
        this.stockItemRepository = stockItemRepository;
    }
    /**
     * Executes the use case to get a stock item by ID.
     * @param id The ID of the stock item to retrieve.
     * @returns A promise that resolves to the StockItem if found, otherwise null.
     */
    async execute(id) {
        if (!id || id.trim() === "") {
            throw new Error("Stock item ID cannot be empty.");
        }
        return this.stockItemRepository.getStockItemById(id);
    }
}
exports.GetStockItemByIdUseCase = GetStockItemByIdUseCase;
