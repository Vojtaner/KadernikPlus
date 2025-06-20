import { Grid, Stack } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import BoxIcon from './BoxIcon'
import DetailColumn from './DetailColumn'

const CustomerProfileGrid = () => {
  return (
    <Grid container rowSpacing={2}>
      <Grid size={4} padding={0}>
        <DetailColumn label={'Jméno a příjmení'} value={'Monika Laurinová'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Telefon'} value={'732 358 754'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Tržby celkem'} value={'12 000,00 Kč'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Náštěvy v půl roce'} value={'6'} />
      </Grid>
      <Grid size={8} alignContent={'center'} justifyContent={'center'}>
        <Stack spacing={2} direction={'row'} alignItems="center" justifyContent={'center'}>
          <BoxIcon size={30} icon={<SmsOutlinedIcon fontSize="small" color="info" />} boxColor="info.light" />
          <BoxIcon
            size={30}
            icon={<DeleteOutlineOutlinedIcon fontSize="small" color="primary" />}
            boxColor="primary.light"
          />
          <BoxIcon
            size={30}
            icon={<PhoneInTalkOutlinedIcon fontSize="small" color="success" />}
            boxColor="success.light"
          />
          <BoxIcon
            size={30}
            icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
            boxColor="secondary.light"
          />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default CustomerProfileGrid
