export type StockItem = {
  id?: string
  itemName: string
  unit: Units
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

export type StockItemDefaultValuesType = Pick<
  StockItem,
  'quantity' | 'totalPrice' | 'id' | 'threshold' | 'unit' | 'itemName' | 'stockId' | 'packageCount' | 'avgUnitPrice'
>

export type StockItemCreateData = Omit<StockItem, 'createdAt' | 'updatedAt' | 'isActive'> & { stockId: string }

export type StockItemBuyData = {
  id: string
  price: number
  quantity: number
}

export type Units = (typeof UnitsObject)[keyof typeof UnitsObject]

export const UnitsObject = {
  G: 'g',
  MG: 'mg',
  L: 'l',
  ML: 'ml',
  CM: 'cm',
  MM: 'mm',
  KS: 'ks',
  BALENI: 'balení',
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
