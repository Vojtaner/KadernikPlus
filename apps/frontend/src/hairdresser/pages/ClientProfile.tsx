import { Button, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import AppTheme from '../../AppTheme'
import AddEditClientFormDialog from '../client/components/AddEditClientFormDialog'
import ClientProfileGrid from '../client/components/ClientProfileGrid'
import { useClientQuery, useDeleteClientMutation } from '../client/queries'
import VisitDetailCard from '../visits/components/VisitDetailCard'
import { formatToCZK } from '../visits/components/VisitDetailGrid'
import { getDateTimeFromUtcToLocal } from '../visits/components/VisitsList'
import AddVisitFormDialog from '../visits/components/AddVisitFormDialog'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BoxIcon from '../../app/components/BoxIcon'
import DeleteDialog from '../visits/components/DeleteDialog'
import { useIntl } from 'react-intl'

const ClientProfile = () => {
  const { clientId } = useParams()
  const { mutate } = useDeleteClientMutation()
  const { data: clientData, isLoading, error } = useClientQuery(clientId)
  const addSnackbarMessage = useAddSnackbarMessage()
  const intl = useIntl()

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
          {intl.formatMessage({ defaultMessage: 'SMS', id: 'clientProfilePage.sms' })}
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
              {intl.formatMessage({ defaultMessage: 'Upravit', id: 'clientProfilePage.edit' })}
            </Button>
          }
          clientId={clientData.id}
        />

        <Button
          size="medium"
          href={`tel:+420${clientData.phone}`}
          sx={{ background: `${AppTheme.palette.success.light}`, color: `${AppTheme.palette.success.main}` }}
          startIcon={<PhoneInTalkOutlinedIcon fontSize="small" color="success" />}>
          {intl.formatMessage({ defaultMessage: 'Volat', id: 'clientProfilePage.call' })}
        </Button>
        <AddVisitFormDialog
          openButton={
            <BoxIcon
              icon={<EditCalendarIcon fontSize="small" color="primary" />}
              sx={{ background: `${AppTheme.palette.primary}` }}
            />
          }
        />
        <DeleteDialog
          openButton={
            <Tooltip
              title={intl.formatMessage({
                defaultMessage: 'Nelze smazat klienta, pokud má návštěvu.',
                id: 'clientProfilePage.deleteClientContrainet',
              })}>
              <BoxIcon
                icon={<DeleteForeverIcon fontSize="small" color="error" />}
                sx={{ background: `${AppTheme.palette.primary.light}` }}
              />
            </Tooltip>
          }
          title={intl.formatMessage({
            defaultMessage: 'Opravdu chcete klienta smazat?',
            id: 'clientProfilePage.deleteClientConfirmTitle',
          })}
          dialogHelperText={intl.formatMessage({
            defaultMessage: 'Klient bude smazán z vaší databáze.',
            id: 'clientProfilePage.deleteClientConfirmHelperTitle',
          })}
          onConfirm={() => clientId && mutate(clientId)}
        />
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
