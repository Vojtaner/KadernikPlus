import type { AddProcedureStockAllowanceType } from '../components/FormDialogs/AddProcedureButton'

export type Procedure = {
  id: string
  visitId: string
  stepOrder: number
  description: string | null
  stockAllowanceId: string | null
  createdAt: Date
}

export type CreateProcedure = {
  id?: string
  stepOrder: number
  createdAt: Date
  description?: string
  visitId: string
  stockAllowances: AddProcedureStockAllowanceType
}

export type PostNewProcedure = {
  description: string
  visitId: string
  stockAllowances: {
    stockItemId: string
    quantity: number
    userId: string
  }[]
}
