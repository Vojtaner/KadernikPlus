import { Grid, Button, Stack } from '@mui/material'
import DetailColumn from '../components/DetailColumn'

const MyProfile = () => {
  return (
    <Grid container rowSpacing={2}>
      <Grid size={4} padding={0}>
        <DetailColumn label={'Jméno'} value={'Monika'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Příjmení'} value={'Laurinová'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Telefon'} value={'+420 732 358 754'} />
      </Grid>

      <Grid size={12}>
        <DetailColumn label={'Facebook link'} value={'https://facebook.com/sdílení_fotek '} />
      </Grid>

      <Grid size={12}>
        <DetailColumn label={'Instagram link'} value={'https://instagram.com/sdílení_fotek '} />
      </Grid>

      <Grid size={12}>
        <DetailColumn label={'Přístup k mému skladu má:'} value={'Pavla Slaničková'} />
      </Grid>
      <Stack direction={'row'} spacing={2}>
        <Button>Smazat profil</Button>
        <Button>Upravit profil</Button>
      </Stack>
    </Grid>
  )
}

export default MyProfile
