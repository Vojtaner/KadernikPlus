import { StockItem } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";

const createFindStockItemByNameUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (name: string): Promise<StockItem | null> => {
      if (!name || name.trim() === "") {
        throw new Error("Stock item name cannot be empty for lookup.");
      }
      return dependencies.stockItemRepositoryDb.findStockItemByName(name);
    },
  };
};

export type FindStockItemByNameUseCaseType = ReturnType<
  typeof createFindStockItemByNameUseCase
>;
const findStockItemByNameUseCase = createFindStockItemByNameUseCase({
  stockItemRepositoryDb,
});

export default findStockItemByNameUseCase;
