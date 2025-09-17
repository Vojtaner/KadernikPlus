import { Stack, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const Loader = (props: { title?: string }) => {
  return (
    <Stack
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
