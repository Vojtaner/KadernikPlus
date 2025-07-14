import type { FieldPath } from 'react-hook-form'
import { UnitsObject, type StockItemCreateData } from '../../../entities/stock-item'
import type { Client } from '../../../entities/client'

export type AppFormState = ClientForm & StockItemForm

export const unitList = Object.values(UnitsObject).map((unit, index) => ({
  id: String(index + 1),
  name: unit,
}))

export type AppFieldPath = FieldPath<AppFormState>

export type ClientForm = Pick<Client, 'firstName' | 'lastName' | 'phone' | 'note'>
export type StockItemForm = StockItemCreateData
