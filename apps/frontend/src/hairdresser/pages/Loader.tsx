import { Stack, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const Loader = (props: { title?: string; direction?: 'row' | 'column' }) => {
  return (
    <Stack
      direction={props.direction || 'column'}
      sx={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CircularProgress color="secondary" />
      <Typography color="grey">{props.title}</Typography>
    </Stack>
  )
}

export default Loader
