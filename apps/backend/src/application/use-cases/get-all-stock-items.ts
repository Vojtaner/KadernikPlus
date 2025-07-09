import { StockItem } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../ports/stock-item-repository";
import stockItemRepositoryDb from "../../infrastructure/data/prisma/prisma-stock-item-repository";

const createGetAllStockItemsUseCaseType = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (): Promise<StockItem[]> => {
      return dependencies.stockItemRepositoryDb.getAllStockItems();
    },
  };
};

export type GetAllStockItemsUseCaseType = ReturnType<
  typeof createGetAllStockItemsUseCaseType
>;

const getAllStockItemsUseCase = createGetAllStockItemsUseCaseType({
  stockItemRepositoryDb,
});

export default getAllStockItemsUseCase;
