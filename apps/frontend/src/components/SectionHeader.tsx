import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const SectionHeader = () => {
  return (
    <Stack
      direction={'row'}
      bgcolor={'white'}
      alignItems="center"
      padding={1}
      borderRadius={'15px 15px 0 0'}
      zIndex={1300}
      marginTop={'-11px'}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
  )
}

export default SectionHeader
