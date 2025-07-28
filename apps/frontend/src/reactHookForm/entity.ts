import type { FieldPath } from 'react-hook-form'
import { UnitsObject, type StockItemCreateData } from '../../../entities/stock-item'
import type { Client } from '../../../entities/client'
import type { ServiceCreateData } from '../../../entities/service'
import type { VisitCreateData, VisitDetailFormType } from '../../../entities/visit'
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
export type ServiceForm = ServiceCreateData
export type VisitCreateForm = VisitCreateData
export type VisitDetailForm = VisitDetailFormType
export type SearchForm = { searchValue: string }
export type AddTeamMemberForm = { teamMemberEmail: string; teamMemberConsentId: string }
export type DateRangeForm = { from: Dayjs; to: Dayjs }
