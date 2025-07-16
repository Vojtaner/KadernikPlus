import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";
import { StockRepositoryPort } from "../../ports/stock-repository";

const createGetStocksByUserIdUseCase = (dependencies: {
  stockRepositoryDb: StockRepositoryPort;
}) => {
  return {
    execute: async (userId: string) => {
      return dependencies.stockRepositoryDb.getStocks(userId);
    },
  };
};

export type GetStocksByUserIdUseCaseType = ReturnType<
  typeof createGetStocksByUserIdUseCase
>;
const getStocksByUserIdUseCase = createGetStocksByUserIdUseCase({
  stockRepositoryDb,
});

export default getStocksByUserIdUseCase;
