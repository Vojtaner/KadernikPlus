import { Grid, Button, Stack, Divider, Typography } from '@mui/material'
import DetailColumn from '../../app/components/DetailColumn'
import { useAuth0 } from '@auth0/auth0-react'
import Loader from '../../components/Loader'
import { UserProfilDialog } from '../../components/UserFormDialog'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  useCancelSubscriptionMutation,
  useDeleteUserMutation,
  useImportPaymentQuery,
  useInvoicesQuery,
  useSubscriptionQuery,
  useUserDataQuery,
} from '../../queries'
import { ContactPicker } from '../components/ContactPicker'
import { ImportAppleContacts } from '../../components/ImportAppleContacts'
import { downloadInvoice } from '../../components/InvoicePdf'
import { getDate } from '../visits/components/VisitsList'
import MuiColorPicker from '../../components/MuiColorPicker'

const MyProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const intl = useIntl()
  const { data: userData } = useUserDataQuery()
  const { data: subscription } = useSubscriptionQuery()
  const { mutate: cancelSubscription } = useCancelSubscriptionMutation()
  const { mutate: deleteUser } = useDeleteUserMutation()
  const { data: importPayment } = useImportPaymentQuery()
  const { data: invoices } = useInvoicesQuery()
  const subscriptionId = subscription ? subscription.id : undefined

  if (isLoading) {
    return <Loader />
  }

  if (!userData) {
    return (
      <Typography>
        {intl.formatMessage({ id: 'myProfile.missingData', defaultMessage: 'Žádná data nenalezena.' })}
      </Typography>
    )
  }

  return (
    isAuthenticated &&
    user && (
      <>
        <Grid container rowSpacing={2}>
          <Grid size={6} padding={0}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'Jméno', id: 'myProfile.firstName' })}
              input={user.given_name}
            />
          </Grid>
          <Grid size={6}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'Příjmení', id: 'myProfile.lastName' })}
              input={user.family_name}
            />
          </Grid>
          <Grid size={6}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'Telefon', id: 'myProfile.phone' })}
              input={user.phone_number}
            />
          </Grid>
          <Grid size={6}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'E-mail', id: 'myProfile.email' })}
              input={user.email}
            />
          </Grid>
          <Grid size={6}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'Souhlasné ID', id: 'myProfile.confirmId' })}
              input={user.sub?.slice(-4)}
            />
          </Grid>
          <Grid size={6}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'Číslo bankovního účtu', id: 'myProfile.bankAccount' })}
              input={userData.bankAccount}
            />
          </Grid>
          <Grid size={6}>
            <DetailColumn
              label={intl.formatMessage({ defaultMessage: 'Odkaz na recenze', id: 'myProfile.reviewUrl' })}
              input={userData.reviewUrl}
            />
          </Grid>
          <Grid size={6}>
            <UserProfilDialog
              openButton={
                <Button>{intl.formatMessage({ defaultMessage: 'Upravit profil', id: 'myProfile.editProfile' })}</Button>
              }
            />
          </Grid>
        </Grid>
        <Divider sx={{ marginY: '30px' }} />

        <Stack spacing={1}>
          <Stack direction="row" spacing={2} sx={{ fontWeight: 'bold' }} borderBottom="1px solid grey">
            <Typography fontWeight="bold" sx={{ width: 150 }}>
              <FormattedMessage id="myProfile.date" defaultMessage="Datum" />
            </Typography>
            <Typography fontWeight="bold" sx={{ width: 150 }}>
              <FormattedMessage id="myProfile.invoiceNumber" defaultMessage="Číslo faktury" />
            </Typography>
            <Typography sx={{ width: 150 }} />
          </Stack>

          {invoices?.map((invoice) => (
            <Stack direction="row" spacing={2} key={invoice.invoiceNumber} alignItems="center">
              <Typography color="info" sx={{ width: 150 }}>
                {getDate(new Date(invoice.issuedAt))}
              </Typography>
              <Typography color="info" sx={{ width: 150 }}>
                {invoice.invoiceNumber}
              </Typography>
              <Button variant="outlined" onClick={() => downloadInvoice(invoice)}>
                <FormattedMessage id="myProfile.downLoadInvoice" defaultMessage="Stáhnout fakturu" />
              </Button>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ marginY: '30px' }} />

        <Grid container rowSpacing={2}>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => deleteUser()}>
              <FormattedMessage id="myProfile.deleteProfile" defaultMessage="Smazat profil" />
            </Button>
            {subscriptionId && (
              <Button onClick={() => cancelSubscription(subscriptionId)}>
                <FormattedMessage id="myProfile.cancelSubscription" defaultMessage="Ukončit předplatné" />
              </Button>
            )}
          </Stack>
        </Grid>
        <Divider sx={{ marginY: '30px' }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontWeight="bold">
            <FormattedMessage id="myProfile.colorScheme" defaultMessage="Schéma aplikace" />
          </Typography>
          <MuiColorPicker />
        </Stack>
        <Divider sx={{ marginY: '30px' }} />
        {importPayment?.status === 'PAID' && (
          <>
            <Divider sx={{ marginY: '30px' }} />
            <Stack spacing={2}>
              <Typography variant="body2">
                <FormattedMessage
                  id="myProfile.importText"
                  defaultMessage="Zde můžete provést hromadný import kontaktů pouze české tel. kontakty. Následně je budete moci editovat
                před uložením."
                />
              </Typography>
              <Grid container rowSpacing={2}>
                <ContactPicker />
              </Grid>
              <Grid container rowSpacing={2} gap={2}>
                <ImportAppleContacts />
              </Grid>
            </Stack>
          </>
        )}
      </>
    )
  )
}

export default MyProfile
