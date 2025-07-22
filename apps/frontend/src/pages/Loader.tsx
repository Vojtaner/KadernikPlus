import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const Loader = () => {
  return (
    <Box
      sx={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CircularProgress color="secondary" />
    </Box>
  )
}

export default Loader
