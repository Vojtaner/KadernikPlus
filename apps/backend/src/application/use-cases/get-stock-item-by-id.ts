import { StockItem } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../ports/stock-item-repository";
import stockItemRepositoryDb from "../../infrastructure/data/prisma/prisma-stock-item-repository";

const createGetStockItemByIdUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (stockItemId: string): Promise<StockItem | null> => {
      if (!stockItemId || stockItemId.trim() === "") {
        throw new Error("Stock item ID or Stock ID cannot be empty.");
      }
      return dependencies.stockItemRepositoryDb.getStockItemById(stockItemId);
    },
  };
};

export type GetStockItemByIdUseCaseType = ReturnType<
  typeof createGetStockItemByIdUseCase
>;
const getStockItemByIdUseCase = createGetStockItemByIdUseCase({
  stockItemRepositoryDb,
});
export default getStockItemByIdUseCase;
