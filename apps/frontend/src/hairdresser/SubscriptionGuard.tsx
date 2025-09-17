import type { PropsWithChildren } from 'react'
import { useSubscriptionQuery } from '../queries'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../routes/AppRoutes'
import Loader from '../hairdresser/pages/Loader'

const SubscriptionGuard = (props: PropsWithChildren) => {
  const { children } = props
  const { data: subscription, isLoading } = useSubscriptionQuery()
  const today = new Date()
  const endDate = subscription && subscription?.endDate ? new Date(subscription.endDate) : null
  const isExpired = endDate ? today > endDate : false

  if (isLoading && !subscription) {
    return <Loader title="Ověřování předplatného..." />
  }

  if (subscription !== undefined && typeof subscription === 'string' && subscription.length === 0) {
    return <Navigate to={ROUTES.subscription.path} replace />
  }

  if (
    subscription &&
    (subscription.status === 'EXPIRED' ||
      (subscription.status === 'CANCELLED' && isExpired) ||
      subscription.status === 'PENDING')
  ) {
    return <Navigate to={ROUTES.subscription.path} replace />
  }

  return children
}

export default SubscriptionGuard
