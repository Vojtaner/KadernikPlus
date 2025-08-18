import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, type PropsWithChildren } from 'react'
import Loader from '../pages/Loader'

const AuthGuard = (props: PropsWithChildren) => {
  const { children } = props
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect()
    }
  }, [isLoading, isAuthenticated, loginWithRedirect])

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

export default AuthGuard
