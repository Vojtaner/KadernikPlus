import { Stack } from '@mui/material'
import { LogLine } from '../components/LogLine.ts'

const Logs = () => {
  return (
    <Stack rowGap={1.5}>
      <LogLine />
      <LogLine />
      <LogLine />
      <LogLine />
    </Stack>
  )
}

export default Logs
