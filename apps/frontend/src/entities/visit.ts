import type { AddProcedureStockAllowanceType } from '../components/FormDialog/AddProcedureButton'
import { type Client } from './client'
import { type Procedure } from './procedure'
import { type Service } from './service'
import { type User, type WithUserId } from './user'

export type Visit = {
  id?: string
  clientId: string
  date: Date
  paidPrice?: number
  deposit?: number
  depositStatus?: DepositStatus | null
  visitStatus?: boolean
  note?: string | null
  hairdresserId?: string
  userId?: string

  serviceIds: string[]
} & Pick<Client, 'firstName' | 'lastName' | 'phone' | 'note'>

export type VisitCreateData = Visit

export type GetVisitsType = Omit<Visit, 'serviceIds' | 'id'> & {
  services: Service[]
  client: WithUserId<Client>
  id: string
}

export type VisitWithServices = {
  client: {
    id: string
    userId: string
    note: string | null
    deposit: boolean
    teamId: string
    firstName: string
    lastName: string
    phone: string | null
  }
  user: User

  visitServices: VisitService[]
  visitStatus: boolean
} & Omit<Visit, 'visitStatus' | 'hairdresserId'>

export type VisitWithServicesWithProceduresWithStockAllowances = VisitWithServices & {
  procedures: (Procedure & { stockAllowances: AddProcedureStockAllowanceType })[]
}

type VisitService = {
  id: string
  service: Service
  serviceId: string
  visitId: string
}

export const DepositStatus = {
  NEZAPLACENO: 'NEZAPLACENO',
  ZAPLACENO: 'ZAPLACENO',
} as const

export type DepositStatus = keyof typeof DepositStatus

export const depositStatusOptions = Object.entries(DepositStatus).map(([key, value]) => ({
  id: key,
  name: value,
}))

export type VisitDetailFormType = Pick<
  Visit,
  'date' | 'paidPrice' | 'deposit' | 'depositStatus' | 'hairdresserId' | 'note'
> & { hairCutId?: string; visitServiceId: string }
