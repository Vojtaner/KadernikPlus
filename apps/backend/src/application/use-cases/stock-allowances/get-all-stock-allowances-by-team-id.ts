import { StockAllowanceRepositoryPort } from "../../../application/ports/stock-allowance-repository";
import stockAllowanceRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-allowance-repository";

const createGetAllStockAllowancesByTeamIdUseCase = (dependencies: {
  stockAllowanceRepositoryDb: StockAllowanceRepositoryPort;
}) => {
  return {
    execute: async (teamId: string, fromDate: Date, toDate: Date) => {
      const stockAllowaces =
        await dependencies.stockAllowanceRepositoryDb.getAllByDatesAndTeamId(
          teamId,
          fromDate,
          toDate
        );

      return stockAllowaces;
    },
  };
};

export type GetAllStockAllowancesByTeamIdUseCaseType = ReturnType<
  typeof createGetAllStockAllowancesByTeamIdUseCase
>;

const getAllStockAllowancesByTeamIdUseCase =
  createGetAllStockAllowancesByTeamIdUseCase({ stockAllowanceRepositoryDb });

export default getAllStockAllowancesByTeamIdUseCase;
