import type { AddProcedureStockAllowanceType } from '../domains/procedure/components/AddProcedureButton'

export type Procedure = {
  id: string
  visitId: string
  stepOrder: number
  description: string | null
  createdAt: Date
  stockAllowanceId: string | null
  stockAllowances: AddProcedureStockAllowanceType
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
