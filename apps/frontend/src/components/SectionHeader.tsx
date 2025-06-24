import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton } from '@mui/material'
import { getNthPathName, getPathNameWithOutSlash, useTypedLocation } from '../routes/reactRouter'

const SectionHeader = () => {
  const { pathname } = useTypedLocation()

  return (
    <Stack
      direction="row"
      bgcolor="white"
      alignItems="center"
      padding={1}
      borderRadius="15px 15px 0 0"
      zIndex={1300}
      marginTop="-11px">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <IconButton href="/">
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
      </Box>
      <Typography
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          width: 'fit-content',
          textAlign: 'center',
          paddingY: 1,
          fontSize: '15px',
          fontWeight: 600,
          paddingX: 2,
        }}>
        {getNthPathName(getPathNameWithOutSlash(pathname), 0)}
      </Typography>
    </Stack>
  )
}

export default SectionHeader
