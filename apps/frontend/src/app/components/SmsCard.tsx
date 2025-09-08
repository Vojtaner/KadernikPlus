import { IconButton, Stack, Typography } from '@mui/material'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import DetailColumn from './DetailColumn'
import AppTheme from '../../AppTheme'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import type { ReactNode } from 'react'

type SmsCardProps = {
  message: string
  customerName: string
  service: string
  daysDelta?: string
  phoneContact: string | null
  dataColumnNames: {
    serviceType: ReactNode
    name: ReactNode
    eventType: ReactNode
  }
}

const SmsCard = (props: SmsCardProps) => {
  const { message, customerName, service, daysDelta, phoneContact, dataColumnNames } = props

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="stretch"
      boxShadow="0px 1px 7px 0px rgba(0,0,0,0.22)"
      borderRadius="10px"
      sx={{ height: '100%' }}>
      <Stack sx={{ borderRadius: 0, paddingLeft: '1rem' }} spacing={1} flex={1}>
        <Stack direction="row" spacing={2}>
          <DetailColumn label={dataColumnNames.name} input={customerName} fontSize={12} />
          {daysDelta && <DetailColumn label={dataColumnNames.eventType} input={daysDelta} fontSize={12} />}
          <DetailColumn label={dataColumnNames.serviceType} input={service} fontSize={12} />
        </Stack>
        <Typography variant="body1" fontSize="12px">
          {message}
        </Typography>
      </Stack>

      <Stack sx={{ height: 'auto', alignSelf: 'stretch' }}>
        <IconButton
          href={`sms://+420${phoneContact}?body=${encodeURIComponent(message)}`}
          sx={{
            flex: 1,
            height: '50%',
            bgcolor: 'info.light',
            borderRadius: '0 10px 0 0',
            borderLeft: `1px dotted ${AppTheme.palette.info.main}`,
          }}>
          <SmsOutlinedIcon fontSize="medium" color="info" />
        </IconButton>
        <IconButton
          href={`https://wa.me/${phoneContact}?body=${encodeURIComponent(message)}`}
          sx={{
            flex: 1,
            height: '50%',
            bgcolor: 'success.light',
            borderRadius: '0 0 10px 0',
            borderLeft: `1px dotted ${AppTheme.palette.success.main}`,
          }}>
          <WhatsAppIcon fontSize="small" color="success" />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default SmsCard
