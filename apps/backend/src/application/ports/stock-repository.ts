import { Stock } from ".prisma/client";

export type StockRepositoryPort = {
  createStock(userId: string, teamId: string): Promise<Stock>;
  getStocks(userId: string): Promise<Stock[]>;
  updateStock(newTeamId: string, stockId: string): Promise<Stock>;
};
