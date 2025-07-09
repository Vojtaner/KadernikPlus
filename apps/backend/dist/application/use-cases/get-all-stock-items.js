"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllStockItemsUseCase = void 0;
/**
 * Represents the use case for retrieving all stock items.
 */
class GetAllStockItemsUseCase {
    constructor(stockItemRepository) {
        this.stockItemRepository = stockItemRepository;
    }
    /**
     * Executes the use case to get all stock items.
     * @returns A promise that resolves to an array of StockItem entities.
     */
    async execute() {
        return this.stockItemRepository.getAllStockItems();
    }
}
exports.GetAllStockItemsUseCase = GetAllStockItemsUseCase;
