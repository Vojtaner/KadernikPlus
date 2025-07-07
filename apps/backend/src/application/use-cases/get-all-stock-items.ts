import { StockItem } from "@/entities/stock-item";
import { IStockItemRepository } from "../ports/stock-item-repository";

/**
 * Represents the use case for retrieving all stock items.
 */
export class GetAllStockItemsUseCase {
  private stockItemRepository: IStockItemRepository;

  constructor(stockItemRepository: IStockItemRepository) {
    this.stockItemRepository = stockItemRepository;
  }

  /**
   * Executes the use case to get all stock items.
   * @returns A promise that resolves to an array of StockItem entities.
   */
  async execute(): Promise<StockItem[]> {
    return this.stockItemRepository.getAllStockItems();
  }
}
