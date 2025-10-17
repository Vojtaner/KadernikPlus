import { useIntl } from 'react-intl'

const ErrorBoundary = () => {
  const intl = useIntl()

  return (
    <div>
      {intl.formatMessage({
        defaultMessage: 'Něco se pokazilo...',
        id: 'errorBoundary',
      })}
    </div>
  )
}

export default ErrorBoundary
