import type { PropsWithChildren } from 'react'
import { useSubscriptionQuery } from '../queries'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../routes/AppRoutes'
import Loader from '../pages/Loader'
import { ErrorBoundary } from '@sentry/react'

const SubscriptionGuard = (props: PropsWithChildren) => {
  const { children } = props
  const { data: subscription, isLoading, isError } = useSubscriptionQuery()

  console.log({ isError, subscription, isLoading })

  if (isLoading && !subscription) {
    return <Loader />
  }

  if (isError || !subscription) {
    return <ErrorBoundary />
  }

  if (subscription.status === 'EXPIRED' || subscription.status === 'CANCELLED') {
    return <Navigate to={ROUTES.subscription.path} replace />
  }

  return children
}

export default SubscriptionGuard
