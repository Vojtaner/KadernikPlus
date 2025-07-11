import { withAuthenticationRequired } from '@auth0/auth0-react'
import type { ComponentType } from 'react'
import Loader from '../pages/Loader'

export const AuthenticationGuard = (props: { component: ComponentType<object> }) => {
  const Component = withAuthenticationRequired(props.component, {
    onRedirecting: () => <Loader />,
  })

  return <Component />
}
