import type { FieldPath } from 'react-hook-form'
import { UnitsObject, type StockItemCreateData } from '../../../entities/stock-item'
import type { Client } from '../../../entities/client'
import type { ServiceCreateData } from '../../../entities/service'

export type AppFormState = ClientForm & StockItemForm & ServiceForm

export const unitList = Object.values(UnitsObject).map((unit, index) => ({
  id: String(index + 1),
  name: unit,
}))

export type AppFieldPath = FieldPath<AppFormState>

export type ClientForm = Pick<Client, 'firstName' | 'lastName' | 'phone' | 'note'>
export type StockItemForm = StockItemCreateData
export type ServiceForm = ServiceCreateData
