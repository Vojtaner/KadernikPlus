import { Box, Paper, Stack, Typography } from '@mui/material'
import AppTheme from '../AppTheme'

const ProcedureCard = () => {
  return (
    <Paper
      sx={{
        boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.12)',
        padding: 1,
      }}>
      <Stack spacing={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Box
          sx={{
            borderRight: `2px dotted ${AppTheme.palette.primary.light}`,
          }}>
          <Typography variant="h6" sx={{ padding: 1 }} color="primary">
            1.
          </Typography>
        </Box>
        <Stack direction={'column'}>
          <Typography variant="body1" sx={{ padding: 1 }}>
            Před aplikací provedeno mytí jemným šamponem, vysušeno ručníkem. Barva míchána 1:1 s 6% oxidantem, nanesena
            nejprve na odrosty, poté do délek, působení 30 minut.
          </Typography>
          <Stack
            direction={'row'}
            rowGap={2}
            columnGap={1}
            alignItems={'center'}
            flexWrap="wrap"
            justifyContent={'flex-start'}>
            <Box boxShadow={'0px 1px 7px 0px rgba(0,0,0,0.12)'} padding={1} borderRadius={2}>
              <Typography variant="body1" fontWeight={600} color="secondary">
                Blondor 30 ml
              </Typography>
            </Box>
            <Box boxShadow={'0px 1px 7px 0px rgba(0,0,0,0.12)'} padding={1} borderRadius={2}>
              <Typography variant="body1" fontWeight={600} color="secondary">
                Blondor 30 ml
              </Typography>
            </Box>
            <Box boxShadow={'0px 1px 7px 0px rgba(0,0,0,0.12)'} padding={1} borderRadius={2}>
              <Typography variant="body1" fontWeight={600} color="secondary">
                Blondor 30 ml
              </Typography>
            </Box>
            <Typography fontWeight={600} color="primary.main">
              + Přidat
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ProcedureCard
