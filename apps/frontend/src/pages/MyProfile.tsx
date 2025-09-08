import { Grid, Button, Stack, Divider } from '@mui/material'
import DetailColumn from '../app/components/DetailColumn'
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
          <Grid size={6}>
            <DetailColumn label={'Číslo bankovního účtu'} input={'111111111/2020'} />
          </Grid>
        </Grid>
        <Divider sx={{ marginY: '30px' }} />

        <Grid container rowSpacing={2}>
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
