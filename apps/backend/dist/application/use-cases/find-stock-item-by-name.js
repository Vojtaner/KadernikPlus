"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindStockItemByNameUseCase = void 0;
/**
 * Represents the use case for finding a single stock item by its unique name.
 */
class FindStockItemByNameUseCase {
    constructor(stockItemRepository) {
        this.stockItemRepository = stockItemRepository;
    }
    /**
     * Executes the use case to find a stock item by name.
     * @param name The name of the stock item to find.
     * @returns A promise that resolves to the StockItem if found, otherwise null.
     */
    async execute(name) {
        if (!name || name.trim() === "") {
            throw new Error("Stock item name cannot be empty for lookup.");
        }
        return this.stockItemRepository.findStockItemByName(name);
    }
}
exports.FindStockItemByNameUseCase = FindStockItemByNameUseCase;
