import { Grid, Button, Stack, Divider } from '@mui/material'
import DetailColumn from '../components/DetailColumn'
import { useAuth0 } from '@auth0/auth0-react'
import Loader from './Loader'

const MyProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <Loader />
  }

  return (
    isAuthenticated &&
    user && (
      <>
        <Grid container rowSpacing={2}>
          <Grid size={6} padding={0}>
            <DetailColumn label={'Jméno'} input={user.given_name} />
          </Grid>
          <Grid size={6}>
            <DetailColumn label={'Příjmení'} input={user.family_name} />
          </Grid>
          <Grid size={6}>
            <DetailColumn label={'Telefon'} input={'+420 732 358 754'} />
          </Grid>
          <Grid size={6}>
            <DetailColumn label={'E-mail'} input={user.email} />
          </Grid>
          <Grid size={6}>
            <DetailColumn label={'Souhlasné ID'} input={user.sub?.slice(-4)} />
          </Grid>
        </Grid>
        <Divider sx={{ marginY: '30px' }} />

        <Grid container rowSpacing={2}>
          <Grid size={12}>
            <DetailColumn label={'Facebook link'} input={'https://facebook.com/sdílení_fotek '} />
          </Grid>

          <Grid size={12}>
            <DetailColumn label={'Instagram link'} input={'https://instagram.com/sdílení_fotek '} />
          </Grid>

          <Grid size={12}>
            <DetailColumn label={'Přístup k mému skladu má:'} input={'Pavla Slaničková'} />
          </Grid>
          <Stack direction={'row'} spacing={2}>
            <Button>Smazat profil</Button>
            <Button>Upravit profil</Button>
          </Stack>
        </Grid>
      </>
    )
  )
}

export default MyProfile
