import { StockItem } from "@/entities/stock-item";
import { IStockItemRepository } from "../ports/stock-item-repository";

/**
 * Represents the use case for finding a single stock item by its unique name.
 */
export class FindStockItemByNameUseCase {
  private stockItemRepository: IStockItemRepository;

  constructor(stockItemRepository: IStockItemRepository) {
    this.stockItemRepository = stockItemRepository;
  }

  /**
   * Executes the use case to find a stock item by name.
   * @param name The name of the stock item to find.
   * @returns A promise that resolves to the StockItem if found, otherwise null.
   */
  async execute(name: string): Promise<StockItem | null> {
    if (!name || name.trim() === "") {
      throw new Error("Stock item name cannot be empty for lookup.");
    }
    return this.stockItemRepository.findStockItemByName(name);
  }
}
