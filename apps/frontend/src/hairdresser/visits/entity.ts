import type { Dayjs } from 'dayjs'
import { type Client } from '../../entities/client'
import type { Procedure } from '../../entities/procedure'
import { type Service } from '../../entities/service'
import { type User, type WithUserId } from '../../entities/user'
import type { AddProcedureStockAllowanceType } from '../procedure/components/AddProcedureButton'
import dayjs from 'dayjs'

export type Visit = {
  id?: string
  clientId: string
  date: Date
  dateTo: Date
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
  dateTo: Date
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

export type VisitRow =
  | {
      isHeader: true
      label: string
      id: string
      date?: never
      client?: never
      serviceName?: never
      visitState?: never
      clientId?: never
      visitDepositPayed?: never
      clientDeposit?: never
    }
  | {
      id: string
      date: string
      dateTo: string
      client: string
      serviceName: string
      visitState: boolean
      visitDepositPayed: boolean
      clientDeposit: boolean
      clientId: string
      isHeader?: false
      label?: never
    }

export const depositStatusOptions = Object.entries(DepositStatus).map(([key, value]) => ({
  id: key,
  name: value,
}))

export type VisitDetailFormType = Pick<
  Visit,
  'date' | 'paidPrice' | 'deposit' | 'depositStatus' | 'hairdresserId' | 'note' | 'dateTo'
> & { hairCutId?: string; visitServiceId: string; visitClosed: boolean }

export const getVisitUrlComposed = (date?: Dayjs, query?: { from?: Dayjs; to?: Dayjs }) => {
  const params = new URLSearchParams()

  if (date && date.isValid()) {
    params.append('date', date.toISOString())
    return `/api/visits?${params.toString()}`
  }

  if (query) {
    if (query.from) {
      params.append('from', dayjs(query.from).format('YYYY-MM-DD'))
    }
    if (query.to) {
      params.append('to', dayjs(query.to).format('YYYY-MM-DD'))
    }

    return `/api/visits?${params.toString()}`
  }

  return '/api/visits'
}

export const getIsVisitInPast = (date: Date) => new Date(date).getTime() < Date.now()

export type VisitsByDateQueryParams = { date?: Dayjs; query?: { from?: Dayjs; to?: Dayjs } }

export const getVisitsByDateQueryKey = (params: VisitsByDateQueryParams) =>
  params?.query
    ? ['visits', dayjs(params.query?.from).format('YYYY-MM-DD'), dayjs(params.query?.to).format('YYYY-MM-DD')]
    : params?.date
      ? ['visits', dayjs(params.date).format('YYYY-MM-DD')]
      : ['visits']

export const getTimeFromUtcToLocal = (date: Date) => {
  return dayjs(date).format('HH:mm')
}
export const getDateTimeFromUtcToLocal = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY - HH:mm')
}
export const getDate = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY')
}
export const getDateShort = (date: Date) => {
  return dayjs(date).format('DD.MM.')
}
export const getDateWithDay = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY - dddd')
}

export const formatPhoneNumber = (digits: string | null): string | undefined => {
  if (!digits) {
    return undefined
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

export const getRowsWithHeaders = (visits: VisitWithServicesWithProceduresWithStockAllowances[]) => {
  const rows: (VisitWithServicesWithProceduresWithStockAllowances | { isHeader: true; label: string; id: string })[] =
    []

  let lastDate: Date | null = null

  for (const visit of visits) {
    const visitDay = getDate(visit.date)
    const lastDay = lastDate ? getDate(lastDate) : null

    if (visitDay !== lastDay) {
      rows.push({
        id: `header-${visit.date}`,
        isHeader: true,
        label: 'Den - ' + getDateWithDay(visit.date),
      })
      lastDate = visit.date
    }
    rows.push(visit)
  }
  return rows
}
