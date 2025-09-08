import type { FieldPath } from 'react-hook-form'
import { UnitsObject, type StockItemCreateData } from '../domains/stock/entity'
import type { Client } from '../entities/client'
import type { ServiceCreateOrUpdateData } from '../entities/service'
import type { CreateVisitType, VisitDetailFormType } from '../domains/visits/entity'
import type { Dayjs } from 'dayjs'

export type AppFormState = ClientForm &
  StockItemForm &
  ServiceForm &
  VisitDetailForm &
  VisitCreateForm &
  AddTeamMemberForm &
  SearchForm & {
    stockAllowances: {
      stockAllowanceId: string
      stockItemId: string
      quantity: number
    }[]
    description: string
  } & DateRangeForm

export const unitList = Object.values(UnitsObject).map((unit, index) => ({
  id: String(index + 1),
  name: unit,
}))

export type AppFieldPath = FieldPath<AppFormState>

export type ClientForm = Pick<Client, 'firstName' | 'lastName' | 'phone' | 'note'>
export type StockItemForm = StockItemCreateData
export type ServiceForm = ServiceCreateOrUpdateData
export type VisitCreateForm = CreateVisitType
export type VisitDetailForm = VisitDetailFormType
export type SearchForm = { searchValue: string }
export type AddTeamMemberForm = { teamMemberEmail: string; teamMemberConsentId: string }
export type DateRangeForm = { from: Dayjs; to: Dayjs }
