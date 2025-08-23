export type GetStockAllowance = {
  createdAt: Date
  id: string
  procedure: { visitId: string; visit: { clientId: string } }
  procedureId: string
  quantity: string
  stockItem: { itemName: string; avgUnitPrice: string; unit: string }
  stockItemId: string
  teamId: string
  user: { name: string }
  userId: string
}

export type ConsumptionTableAllRecordType = {
  id: string
  stockItemName: string
  totalPrice: number
  stockAllowanceQuantity: number
  unit: string
  user: string
  date: Date
  visitId: string
  clientId: string
}
export type ConsumptionTableByProductByUserType = {
  id: string
  stockItemName: string
  totalPrice: number
  totalQuantity: number
  unit: string
  user: string
}

export type UserStockItemAllowanceSummary = {
  id: string
  user: string
  stockItemName: string
  unit: string
  totalQuantity: number
  totalPrice: number
}

export type StockViewKey = 'byUser' | 'byProduct' | 'allRecords'

export function createStockAllowancesTableByProductByUser(
  stockAllowances: GetStockAllowance[],
  keyExtractor: (item: GetStockAllowance) => string
): UserStockItemAllowanceSummary[] {
  const summaryMap: Record<string, UserStockItemAllowanceSummary> = {}

  stockAllowances.forEach((stockAllowance) => {
    const key = keyExtractor(stockAllowance)
    const quantity = Number(stockAllowance.quantity)
    const price = quantity * Number(stockAllowance.stockItem.avgUnitPrice)

    if (summaryMap[key]) {
      summaryMap[key].totalQuantity += quantity
      summaryMap[key].totalPrice += price
    } else {
      summaryMap[key] = {
        id: key,
        user: stockAllowance.user.name,
        stockItemName: stockAllowance.stockItem.itemName,
        unit: stockAllowance.stockItem.unit,
        totalQuantity: quantity,
        totalPrice: price,
      }
    }
  })

  return Object.values(summaryMap)
}

export const createStockAllowancesTableAllRecords = (
  stockAllowances: GetStockAllowance[]
): ConsumptionTableAllRecordType[] =>
  stockAllowances.map((stockAllowance) => ({
    id: stockAllowance.id,
    stockItemName: stockAllowance.stockItem.itemName,
    totalPrice: Number(stockAllowance.quantity) * Number(stockAllowance.stockItem.avgUnitPrice),
    stockAllowanceQuantity: Number(stockAllowance.quantity),
    unit: stockAllowance.stockItem.unit,
    user: stockAllowance.user.name,
    date: stockAllowance.createdAt,
    visitId: stockAllowance.procedure.visitId,
    clientId: stockAllowance.procedure.visit.clientId,
  }))
