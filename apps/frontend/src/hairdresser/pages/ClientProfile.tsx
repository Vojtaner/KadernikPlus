import { Button, Divider, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import AppTheme from '../../AppTheme'
import AddEditClientFormDialog from '../client/components/AddEditClientFormDialog'
import ClientProfileGrid from '../client/components/ClientProfileGrid'
import { useClientQuery } from '../client/queries'
import VisitDetailCard from '../visits/components/VisitDetailCard'
import { formatToCZK } from '../visits/components/VisitDetailGrid'
import { getDateTimeFromUtcToLocal } from '../visits/components/VisitsList'

const ClientProfile = () => {
  const { clientId } = useParams()
  const { data: clientData, isLoading, error } = useClientQuery(clientId)
  const addSnackbarMessage = useAddSnackbarMessage()

  if (isLoading) {
    return <Loader />
  }

  if (!clientData || error) {
    addSnackbarMessage({ type: 'error', text: error?.response?.data.error })
    return <Typography>{error && error?.response?.data.error}</Typography>
  }

  return (
    <Stack spacing={2}>
      <ClientProfileGrid clientData={clientData} />

      <Divider />
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
        <Button
          size="medium"
          href={`sms:+420${clientData.phone}`}
          sx={{ background: `${AppTheme.palette.info.light}`, color: `${AppTheme.palette.info.main}` }}
          startIcon={<SmsOutlinedIcon fontSize="small" color="info" />}>
          Poslat SMS
        </Button>
        <AddEditClientFormDialog
          defaultValues={{
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            phone: clientData.phone,
            note: clientData.note,
          }}
          openButton={
            <Button
              size="medium"
              sx={{ background: `${AppTheme.palette.primary.light}` }}
              startIcon={<EditOutlinedIcon fontSize="small" color="secondary" />}>
              Upravit klienta
            </Button>
          }
          clientId={clientData.id}
        />
        <Button
          size="medium"
          href={`tel:+420${clientData.phone}`}
          sx={{ background: `${AppTheme.palette.success.light}`, color: `${AppTheme.palette.success.main}` }}
          startIcon={<PhoneInTalkOutlinedIcon fontSize="small" color="success" />}>
          Volat
        </Button>
      </Stack>
      <Divider />

      {clientData.visits.map((visit, index) => {
        return (
          <VisitDetailCard
            visitId={visit.id}
            date={getDateTimeFromUtcToLocal(visit.date)}
            index={index + 1}
            clientId={clientData.id}
            key={index}
            paidPrice={formatToCZK(Number(visit.paidPrice))}
          />
        )
      })}
    </Stack>
  )
}
export default ClientProfile
