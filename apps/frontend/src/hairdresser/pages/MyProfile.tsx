import { Grid, Button, Stack, Divider, Typography } from '@mui/material'
import DetailColumn from '../../app/components/DetailColumn'
import { useAuth0 } from '@auth0/auth0-react'
import Loader from './Loader'
import { UserProfilDialog } from '../UserFormDialog'
import { useIntl } from 'react-intl'
import {
  useCancelSubscriptionMutation,
  useDeleteUserMutation,
  useSubscriptionQuery,
  useUserDataQuery,
} from '../../queries'
import { ContactPicker } from '../ContactPicker'
import { ImportAppleContacts } from '../ImportAppleContacts'

const MyProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const intl = useIntl()
  const { data: userData } = useUserDataQuery()
  const { data: subscription } = useSubscriptionQuery()
  const { mutate: cancelSubscription } = useCancelSubscriptionMutation()
  const { mutate: deleteUser } = useDeleteUserMutation()
  const subscriptionId = subscription ? subscription.id : undefined

  if (isLoading) {
    return <Loader />
  }

  if (!userData) {
    return <Typography>Žádná data nenalezeny.</Typography>
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
        </Grid>
        <Divider sx={{ marginY: '30px' }} />

        <Grid container rowSpacing={2}>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => deleteUser()}>
              {intl.formatMessage({ defaultMessage: 'Smazat profil', id: 'myProfile.deleteProfile' })}
            </Button>
            {subscriptionId && (
              <Button onClick={() => cancelSubscription(subscriptionId)}>
                {intl.formatMessage({ defaultMessage: 'Ukončit předplatné', id: 'myProfile.cancelSubscription' })}
              </Button>
            )}
            <UserProfilDialog
              openButton={
                <Button>{intl.formatMessage({ defaultMessage: 'Upravit profil', id: 'myProfile.editProfile' })}</Button>
              }
            />
          </Stack>
        </Grid>
        <Divider sx={{ marginY: '30px' }} />
        <Stack spacing={2}>
          <Typography variant="body2">
            Zde můžete provést hromadný import kontaktů pouze česká tel. kontakty.
          </Typography>
          <Grid container rowSpacing={2}>
            <ContactPicker />
          </Grid>
          <Grid container rowSpacing={2} gap={2}>
            <ImportAppleContacts />
          </Grid>
        </Stack>
      </>
    )
  )
}

export default MyProfile
