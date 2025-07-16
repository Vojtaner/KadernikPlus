import { StockItem, StockItemCreateData } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";

const createCreateStockItemUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (data: StockItemCreateData): Promise<StockItem> => {
      if (!data.itemName || data.itemName.trim() === "") {
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

      const newStockItem =
        await dependencies.stockItemRepositoryDb.createStockItem(data);

      return newStockItem;
    },
  };
};

export type CreateStockItemUseCaseType = ReturnType<
  typeof createCreateStockItemUseCase
>;

const createStockItemUseCase = createCreateStockItemUseCase({
  stockItemRepositoryDb,
});

export default createStockItemUseCase;
