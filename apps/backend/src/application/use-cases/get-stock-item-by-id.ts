import { StockItem } from "@/entities/stock-item";
import { IStockItemRepository } from "../ports/stock-item-repository";

/**
 * Represents the use case for retrieving a single stock item by its ID.
 */
export class GetStockItemByIdUseCase {
  private stockItemRepository: IStockItemRepository;

  constructor(stockItemRepository: IStockItemRepository) {
    this.stockItemRepository = stockItemRepository;
  }

  /**
   * Executes the use case to get a stock item by ID.
   * @param id The ID of the stock item to retrieve.
   * @returns A promise that resolves to the StockItem if found, otherwise null.
   */
  async execute(id: string): Promise<StockItem | null> {
    if (!id || id.trim() === "") {
      throw new Error("Stock item ID cannot be empty.");
    }
    return this.stockItemRepository.getStockItemById(id);
  }
}
