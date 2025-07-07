import { StockItem, StockItemCreateData } from "@/entities/stock-item"; // Adjust path if needed
import { IStockItemRepository } from "../ports/stock-item-repository";

/**
 * Represents the use case for adding a new stock item.
 * This orchestrates the business logic and interacts with the repository.
 */
export class AddStockItemUseCase {
  private stockItemRepository: IStockItemRepository;

  constructor(stockItemRepository: IStockItemRepository) {
    this.stockItemRepository = stockItemRepository;
  }

  /**
   * Executes the use case to add a new stock item.
   * @param data The data for the new stock item.
   * @returns A promise that resolves to the created StockItem.
   * @throws {Error} If validation fails or the repository operation fails.
   */
  async execute(data: StockItemCreateData): Promise<StockItem> {
    // --- Business Logic & Validation ---
    if (!data.name || data.name.trim() === "") {
      throw new Error("Stock item name cannot be empty.");
    }
    if (!data.unit || data.unit.trim() === "") {
      throw new Error("Stock item unit cannot be empty.");
    }
    if (data.quantity < 0) {
      throw new Error("Stock item quantity cannot be negative.");
    }
    if (data.threshold < 0) {
      throw new Error("Stock item threshold cannot be negative.");
    }
    // isActive is a boolean, so simple presence check or default is enough,
    // but you could add specific checks if needed (e.g., must be true/false explicitly)
    if (typeof data.isActive !== "boolean" && data.isActive !== undefined) {
      throw new Error("Stock item isActive must be a boolean.");
    }

    // The repository handles the unique name check,
    // so this use case can rely on that error propagation.

    // --- Interact with Repository ---
    const newStockItem = await this.stockItemRepository.addStockItem(data);

    return newStockItem;
  }
}
