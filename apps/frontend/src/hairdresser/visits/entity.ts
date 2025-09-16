import type { Dayjs } from 'dayjs'
import { type Client } from '../../entities/client'
import type { Procedure } from '../../entities/procedure'
import { type Service } from '../../entities/service'
import { type User, type WithUserId } from '../../entities/user'
import type { AddProcedureStockAllowanceType } from '../procedure/components/AddProcedureButton'

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

export type CreateVisitType = {
  clientId?: string
  date: Date
  deposit?: number
  depositRequired: boolean
  serviceIds: string[]
  firstName: string
  lastName: string
  phone: string
  clientNote?: string
}

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

export type VisitWithServicesHotFix = {
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
  procedures: Procedure[]
  user: User
  visitServices: VisitService[]
  visitStatus: boolean
} & Omit<Visit, 'visitStatus' | 'hairdresserId'>

export type VisitWithServicesWithProceduresWithStockAllowances = VisitWithServices & {
  procedures: {
    id: string
    visitId: string
    stepOrder: number
    description: string | null
    stockAllowanceId: string | null
    createdAt: Date
    stockAllowances: AddProcedureStockAllowanceType
  }[]
}

export type VisitService = {
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
> & { hairCutId?: string; visitServiceId: string; visitClosed: boolean }

export const getVisitUrlComposed = (date?: Dayjs, query?: { from?: Dayjs; to?: Dayjs }) => {
  const params = new URLSearchParams()

  if (date && date.isValid()) {
    params.append('date', date.toISOString())
    return `/api/visits?${params.toString()}`
  }

  if (query) {
    if (query.from) {
      params.append('from', query.from.toISOString())
    }
    if (query.to) {
      params.append('to', query.to.toISOString())
    }

    return `/api/visits?${params.toString()}`
  }

  return '/api/visits'
}
