import { Stack } from '@mui/material'
import { LogLine } from '../components/LogLine.tsx'
import { useUserLogsQuery } from '../queries.ts'
import ErrorBoundary from './ErrorBoundary.tsx'

const Logs = () => {
  const { data } = useUserLogsQuery('1')

  if (!data) {
    return <ErrorBoundary />
  }

  return (
    <Stack rowGap={1.5}>
      {data &&
        data.map((log) => (
          <LogLine
            key={log.id}
            actionType={log.actionType}
            dateTime={log.dateTime}
            description={log.description}
            userName={log.userName}
          />
        ))}
    </Stack>
  )
}

export default Logs
