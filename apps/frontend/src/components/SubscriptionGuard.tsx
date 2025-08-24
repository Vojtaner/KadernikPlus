import type { PropsWithChildren } from 'react'
import { useSubscriptionQuery } from '../queries'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/AppRoutes'
import Loader from '../pages/Loader'
import { ErrorBoundary } from '@sentry/react'

const SubscriptionGuard = (props: PropsWithChildren) => {
  const { children } = props
  const { data: subscription, isLoading, isError } = useSubscriptionQuery()
  const navigate = useNavigate()

  if (isLoading && !subscription) {
    return <Loader />
  }

  if (isError || !subscription) {
    return <ErrorBoundary />
  }

  if (subscription.status === 'ACTIVE') {
    navigate('/')
    return children
  }

  navigate(ROUTES.subscription.path)
  return
}

export default SubscriptionGuard
