/**
 * Represents a Client entity in the domain.
 * This interface defines the core properties of a client (customer).
 */
export type Client = {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  note?: string | null
  deposit: boolean
  userId?: string
  teamId?: string
}

export type ClientOrUpdateCreateData = {
  firstName?: string
  lastName?: string
  phone?: string | null
  note?: string | null
  id?: string
  deposit?: boolean
  teamId?: string
}

/**
 * Interface for creating a new Client.
 */
// export type ClientCreateData = Client;

export type ClientWithVisits = Client & {
  visits: ReturnedClientVisit[]
}
export type ClientWithVisitsWithVisitServices = Client & {
  visits: ReturnedClientVisit[]
}

export type ReturnedClientVisit = {
  id: string
  deposit: number | null
  note: string | null
  userId: string
  teamId: string
  clientId: string
  date: Date
  depositStatus: string | null
  visitStatus: boolean | null
  paidPrice: number | null
  visitServices: {
    id: string
    visitId: string
    serviceId: string
    service: {
      id: string
      userId: string
      teamId: string | null
      serviceName: string
      basePrice: number
    }
  }[]
}

export type ClientSearchPayload = {
  nameOrPhone: string
}
