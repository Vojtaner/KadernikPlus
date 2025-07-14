import type { FieldPath } from 'react-hook-form'
import { type Client } from '../../../entities/client'

// export type AppFormState = {
//   searchBar: string
//   newVisitCustomerName: string
//   newVisitHairCut: string
//   newClientPhone: number
//   newClientFirstName: string
//   newClientSecondName: string
//   newWarehouseItemName: string
//   newWarehouseItemUnit: typeof Units
//   newBuyItemName: string
//   newBuyItemAmount: number
// }

export type AppFormState = ClientForm

export const Units = {
  G: 'g',
  MG: 'mg',
  L: 'l',
  ML: 'ml',
  CM: 'cm',
  MM: 'mm',
  KS: 'ks',
  BALENI: 'balení',
} as const

export const unitList = Object.values(Units).map((unit, index) => ({
  id: String(index + 1),
  name: unit,
}))

export type AppFieldPath = FieldPath<AppFormState>

export type ClientForm = Pick<Client, 'firstName' | 'lastName' | 'phone' | 'note'>

// jmeno, prijmeni, telefon, poznámka
