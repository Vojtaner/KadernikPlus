import { Grid, Button, Stack } from '@mui/material'
import DetailColumn from '../components/DetailColumn'

const MyProfile = () => {
  return (
    <Grid container rowSpacing={2}>
      <Grid size={4} padding={0}>
        <DetailColumn label={'Jméno'} input={'Monika'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Příjmení'} input={'Laurinová'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Telefon'} input={'+420 732 358 754'} />
      </Grid>

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
  )
}

export default MyProfile
