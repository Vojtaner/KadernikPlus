export type SubscriptionPlans = 'pro'

export type ImportStatus = 'PAID' | 'CANCELLED' | 'PENDING'
export type SubscriptionStates = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'

export type SubscriptionCreateData = {
  plan: SubscriptionPlans
  status: SubscriptionStates
  currency: 'CZK'
  price: number
}

export type Subscription = {
  id: string
  plan: SubscriptionPlans
  status: SubscriptionStates
  currency: 'CZK'
  price: number
  endDate: string
  startDate: string
  userId: string
}
export type CreateImportPayment = {
  currency: 'CZK'
  price: number
}

export type Payment = {
  id: string
  refId: string
  status: ImportStatus
}
