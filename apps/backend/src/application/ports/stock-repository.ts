import { Stock } from ".prisma/client";

export type StockRepositoryPort = {
  createStock(userId: string): Promise<Stock>;
};
