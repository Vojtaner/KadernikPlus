import { StockItem, StockItemCreateData } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../ports/stock-item-repository";
import stockItemRepositoryDb from "../../infrastructure/data/prisma/prisma-stock-item-repository";

const createAddStockItemUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (data: StockItemCreateData): Promise<StockItem> => {
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
      if (typeof data.isActive !== "boolean" && data.isActive !== undefined) {
        throw new Error("Stock item isActive must be a boolean.");
      }

      const newStockItem =
        await dependencies.stockItemRepositoryDb.addStockItem(data);

      return newStockItem;
    },
  };
};

export type AddStockItemUseCaseType = ReturnType<
  typeof createAddStockItemUseCase
>;

const addStockItemUseCase = createAddStockItemUseCase({
  stockItemRepositoryDb,
});

export default addStockItemUseCase;
