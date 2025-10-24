import type {
  UserStockItemAllowanceSummary,
  ConsumptionTableAllRecordType,
  GetStockAllowance,
} from '../../../entity';

export function createStockAllowancesTableByProductByUser(
  stockAllowances: GetStockAllowance[],
  keyExtractor: (item: GetStockAllowance) => string
): UserStockItemAllowanceSummary[] {
  const summaryMap: Record<string, UserStockItemAllowanceSummary> = {};

  stockAllowances.forEach(stockAllowance => {
    const key = keyExtractor(stockAllowance);
    const quantity = Number(stockAllowance.quantity);
    const price = quantity * Number(stockAllowance.avgUnitPrice);

    if (summaryMap[key]) {
      summaryMap[key].totalQuantity += quantity;
      summaryMap[key].totalPrice += price;
    } else {
      summaryMap[key] = {
        id: key,
        user: stockAllowance.user.name,
        stockItemName: stockAllowance.stockItemName,
        unit: stockAllowance.stockItem.unit,
        totalQuantity: quantity,
        totalPrice: price,
      };
    }
  });

  return Object.values(summaryMap);
}

export const createStockAllowancesTableAllRecords = (
  stockAllowances: GetStockAllowance[]
): ConsumptionTableAllRecordType[] =>
  stockAllowances.map(stockAllowance => ({
    id: stockAllowance.id,
    stockItemName: stockAllowance.stockItemName,
    totalPrice: Number(stockAllowance.quantity) * Number(stockAllowance.avgUnitPrice),
    stockAllowanceQuantity: Number(stockAllowance.quantity),
    unit: stockAllowance.stockItem.unit,
    user: stockAllowance.user.name,
    date: stockAllowance.createdAt,
    visitId: stockAllowance.procedure.visitId,
    clientId: stockAllowance.procedure.visit.clientId,
  }));
