import { StockItem, StockItemCreateData } from "@/entities/stock-item";

/**
 * Defines the interface for interacting with StockItem data.
 * This abstracts away the underlying database implementation.
 */
export interface IStockItemRepository {
  /**
   * Adds a new stock item to the repository.
   * @param data The data for the new stock item.
   * @returns The created StockItem entity.
   */
  addStockItem(data: StockItemCreateData): Promise<StockItem>;

  /**
   * Retrieves a stock item by its unique ID.
   * @param id The ID of the stock item.
   * @returns The StockItem entity if found, otherwise null.
   */
  getStockItemById(id: string): Promise<StockItem | null>;

  /**
   * Finds a stock item by its unique name.
   * @param name The name of the stock item.
   * @returns The StockItem entity if found, otherwise null.
   */
  findStockItemByName(name: string): Promise<StockItem | null>;

  /**
   * Retrieves all stock items.
   * @returns A promise that resolves to an array of StockItem entities.
   */
  getAllStockItems(): Promise<StockItem[]>;
}
