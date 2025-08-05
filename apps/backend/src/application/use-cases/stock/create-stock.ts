// import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";
// import { StockRepositoryPort } from "../../ports/stock-repository";

// const createCreateStockUseCase = (dependencies: {
//   stockRepositoryDb: StockRepositoryPort;
// }) => {
//   return {
//     execute: async (userId: string) => {
//       return dependencies.stockRepositoryDb.createStock(userId, "te");
//     },
//   };
// };

// export type createStockUseCaseType = ReturnType<
//   typeof createCreateStockUseCase
// >;
// const createStock = createCreateStockUseCase({ stockRepositoryDb });

// export default createStock;
