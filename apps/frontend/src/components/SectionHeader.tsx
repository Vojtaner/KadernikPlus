import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const SectionHeader = () => {
  return (
    <Stack>
      <Stack direction={'row'} sx={{ position: 'relative' }} alignItems="center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: '10px',
            paddingY: '10px',
          }}>
          <ArrowBackIcon fontSize="medium" />
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
            paddingX: 2,
          }}>
          Přehled
        </Typography>
      </Stack>
    </Stack>
  )
}

export default SectionHeader
