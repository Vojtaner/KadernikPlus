import { StockItem } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../ports/stock-item-repository";
import stockItemRepositoryDb from "../../infrastructure/data/prisma/prisma-stock-item-repository";

const createGetStockItemsByStockIdUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (stockId: string): Promise<StockItem[] | null> => {
      if (!stockId || stockId.trim() === "") {
        throw new Error("Stock item ID or Stock ID cannot be empty.");
      }
      return dependencies.stockItemRepositoryDb.getStockItemsByStockId(stockId);
    },
  };
};

export type GetStockItemsByStockIdUseCaseType = ReturnType<
  typeof createGetStockItemsByStockIdUseCase
>;
const getStockItemsByStockIdUseCase = createGetStockItemsByStockIdUseCase({
  stockItemRepositoryDb,
});
export default getStockItemsByStockIdUseCase;
