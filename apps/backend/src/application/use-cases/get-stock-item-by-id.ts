import { StockItem } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../ports/stock-item-repository";
import stockItemRepositoryDb from "../../infrastructure/data/prisma/prisma-stock-item-repository";

const createGetStockItemByIdUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (id: string): Promise<StockItem | null> => {
      if (!id || id.trim() === "") {
        throw new Error("Stock item ID cannot be empty.");
      }
      return dependencies.stockItemRepositoryDb.getStockItemById(id);
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
