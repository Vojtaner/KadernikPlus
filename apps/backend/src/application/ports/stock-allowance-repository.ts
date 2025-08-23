import { StockAllowance } from "@prisma/client";

export type StockAllowanceRepositoryPort = {
  getAllByDatesAndTeamId: (
    teamId: string,
    fromDate: Date,
    toDate: Date
  ) => Promise<StockAllowance[]>;
};
