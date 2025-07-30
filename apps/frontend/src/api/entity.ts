import type { Dayjs } from 'dayjs'
import type { Units } from '../../../entities/stock-item'

export type UserType = { userId: string; name: string; age: number; email: string }
export type UserLog = { id: string; actionType: string; dateTime: Dayjs; description: string; userName: string }

export type Stock = {
  id: string
  stockName: string
  createdAt: Date
  unit: Units
  ownerId: string
  price: number
}
