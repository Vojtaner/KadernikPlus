import { Stock } from ".prisma/client";

export type StockRepositoryPort = {
  createStock(userId: string, teamId: string): Promise<Stock>;
  getStocks(userId: string): Promise<Stock[]>;
  updateStock(newTeamId: string, userId: string): Promise<Stock>;
  getStocksByOwnerId(userId: string): Promise<Stock | null>;
};
