export type UserType = { userId: string; name: string; age: number; email: string }
export type UserLog = { id: string; actionType: string; dateTime: string; description: string; userName: string }
export type WareHouseItemType = {
  id: number
  item: string
  price: number
  unit: string
}
export type WareHouseItemStateType = WareHouseItemType & { amount: number; minAmount: number }
