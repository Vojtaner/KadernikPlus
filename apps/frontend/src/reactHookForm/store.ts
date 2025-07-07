import { useForm, useFormContext, type FieldPath } from 'react-hook-form'

export type AppFormState = {
  searchBar: string
  newVisitCustomerName: string
  newVisitHairCut: string
  newClientPhone: number
  newClientFirstName: string
  newClientSecondName: string
  newWarehouseItemName: string
  newWarehouseItemUnit: typeof Units
  newBuyItemName: string
  newBuyItemAmount: number
  loginName: string
  loginPassword: string
}

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

export const useAppForm = () => {
  const methods = useForm<AppFormState>()

  return methods
}

export const useAppFormContext = () => {
  const methods = useFormContext<AppFormState>()

  return methods
}

export const useAppCurrentWatch = (fieldPath: AppFieldPath) => {
  const { watch, getValues } = useAppForm()

  watch(fieldPath)

  return getValues(fieldPath)
}
