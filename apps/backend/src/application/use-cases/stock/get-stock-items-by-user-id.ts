import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";
import { Stock, StockItem } from "@prisma/client";
import getStocksByUserIdUseCase, {
  GetStocksByUserIdUseCaseType,
} from "./get-stocks-by-user-id";

const createGetStockItemsByStocksUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
  getStocksByUserIdUseCase: GetStocksByUserIdUseCaseType;
}) => {
  return {
    execute: async (
      userId: string,
      stockId: string | undefined
    ): Promise<
      (Stock & {
        stockItems: StockItem[];
      })[]
    > => {
      const stocks = await dependencies.getStocksByUserIdUseCase.execute(
        userId
      );

      const stockIds = stocks.map((stock) => stock.id);

      const stockItemsByStocks =
        dependencies.stockItemRepositoryDb.getStockItemsByStocks(
          stockId ? [stockId] : stockIds
        );

      return stockItemsByStocks;
    },
  };
};

export type GetStockItemsByStocksIdUseCaseType = ReturnType<
  typeof createGetStockItemsByStocksUseCase
>;
const getStockItemsByStocksIdUseCase = createGetStockItemsByStocksUseCase({
  stockItemRepositoryDb,
  getStocksByUserIdUseCase,
});
export default getStockItemsByStocksIdUseCase;
