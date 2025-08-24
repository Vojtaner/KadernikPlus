export type SubscriptionPlans = 'pro'
export type SubscriptionStates = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'

export type SubscriptionCreateData = {
  plan: SubscriptionPlans
  status: SubscriptionStates
  currency: 'CZK'
  price: number
}

export type Subscription = {
  plan: SubscriptionPlans
  status: SubscriptionStates
  currency: 'CZK'
  price: number
  endDate: string
  startDate: string
  userId: string
}
