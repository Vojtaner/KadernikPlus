import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, type PropsWithChildren } from 'react'
import Loader from '../../hairdresser/Loader'
import { useIntl } from 'react-intl'

const AuthGuard = (props: PropsWithChildren) => {
  const { children } = props
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()
  const intl = useIntl()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect()
    }
  }, [isLoading, isAuthenticated, loginWithRedirect])

  if (isLoading) {
    return (
      <Loader
        title={intl.formatMessage({
          id: 'authGuard.userAuthenticationLoader',
          defaultMessage: 'Ověřování uživatele...',
        })}
      />
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

export default AuthGuard
