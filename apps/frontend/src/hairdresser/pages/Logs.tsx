import Stack from '@mui/material/Stack'
import { useLogsQuery } from '../../queries.ts'
import ErrorBoundary from './ErrorBoundary.tsx'
import dayjs from 'dayjs'
import { LogLine } from '../LogLine.tsx'

const Logs = () => {
  const { data: logs } = useLogsQuery()

  if (!logs) {
    return <ErrorBoundary />
  }

  return (
    <Stack rowGap={1.5}>
      {logs.map((log) => (
        <LogLine key={log.id} dateTime={dayjs(log.createdAt)} description={log.message} userName={log.user.name} />
      ))}
    </Stack>
  )
}

export default Logs
