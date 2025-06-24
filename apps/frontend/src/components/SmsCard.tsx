import { IconButton, Paper, Stack, Typography } from '@mui/material'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import DetailColumn from './DetailColumn'
import AppTheme from '../AppTheme'

type SmsCardProps = {
  text: string
  customerName: string
  haircut: string
}

const SmsCard = (props: SmsCardProps) => {
  const { text, customerName, haircut } = props

  return (
    <Paper
      sx={{
        boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.12)',
        borderRadius: '10px',
      }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack sx={{ borderRadius: 0, padding: '1rem' }} spacing={1}>
          <Stack direction="row" spacing={2}>
            <DetailColumn label="Jméno" value={customerName} fontSize={12} />
            <DetailColumn label="Návštěva" value="před 2 dny" fontSize={12} />
            <DetailColumn label="Účes" value={haircut} fontSize={12} />
          </Stack>
          <Typography variant="body1" fontSize="12px">
            {text}
          </Typography>
        </Stack>
        <IconButton
          sx={{
            bgcolor: 'info.light',
            alignSelf: 'stretch',
            borderRadius: '0 10px 10px 0',
            borderLeft: `1px dotted ${AppTheme.palette.info.main}`,
          }}>
          <SmsOutlinedIcon fontSize="medium" color="info" />
        </IconButton>
      </Stack>
    </Paper>
  )
}

export default SmsCard
