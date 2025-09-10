import type { Dayjs } from 'dayjs'
import type { Unit } from '../hairdresser/stock/entity'

export type UserType = { userId: string; name: string; age: number; email: string }
export type UserLog = { id: string; actionType: string; dateTime: Dayjs; description: string; userName: string }

export type Stock = {
  id: string
  stockName: string
  createdAt: Date
  unit: Unit
  ownerId: string
  price: number
}
