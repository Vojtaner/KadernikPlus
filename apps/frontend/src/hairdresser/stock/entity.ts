import type { Stock } from '../../api/entity'

export type StockItem = {
  id?: string
  itemName: string
  unit: Unit
  totalPrice: number
  quantity: number
  threshold: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  stockId: string
  packageCount: number
  avgUnitPrice: number
  lastPackageQuantity: number
}

export type StockItemFormUsagePurposeType = 'purchase' | 'purchaseAndNewStockItem' | 'stockItem'

export type StockItemDefaultValuesType = Pick<
  StockItem,
  | 'quantity'
  | 'totalPrice'
  | 'id'
  | 'threshold'
  | 'unit'
  | 'itemName'
  | 'stockId'
  | 'packageCount'
  | 'avgUnitPrice'
  | 'lastPackageQuantity'
>

export type ExistingStockItem = {
  id: string
  itemName: string
  unit: Unit
  totalPrice: number
  quantity: number
  threshold: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  stockId: string
  packageCount: number
  avgUnitPrice: number
  lastPackageQuantity: number
}

export type StockItemCreateData = Omit<StockItem, 'createdAt' | 'updatedAt' | 'isActive' | 'lastPackageQuantity'> & {
  stockId: string
}

export type StockItemBuyData = {
  id: string
  price: number
  quantity: number
}

export const UnitsObject = {
  G: 'g',
  ML: 'ml',
  KS: 'ks',
}

export type StockAllowance = {
  createdAt?: Date
  id?: string
  procedureId?: string
  quantity: string
  stockItem?: StockItem
  stockItemId: string
  userId?: string
}

export type StockAllowanceFieldArrayType = {
  stockItemId: string
  quantity: number
  id: string
}

export type Unit = (typeof UnitsObject)[keyof typeof UnitsObject]
export type StockWithStockItems = Stock & { stockItems: ExistingStockItem[] }

export const mapStocksStockItemsToFlatStockItems = (
  stockWithstockItems?: StockWithStockItems[]
): ExistingStockItem[] | undefined => {
  if (!stockWithstockItems) {
    return
  }
  return stockWithstockItems.flatMap((stock) => stock.stockItems)
}
