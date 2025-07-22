import { Grid, Stack, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import BoxIcon from './BoxIcon'
import DetailColumn from './DetailColumn'
import { useClientQuery } from '../queries'
import { useParams } from 'react-router-dom'
import Loader from '../pages/Loader'
import { formatToCZK } from '../pages/VisitDetailGrid'
import AddOrUpdateClientItemButton from './AddOrUpdateClientItemButton'

const ClientProfileGrid = () => {
  const { clientId } = useParams()
  const { data: clientData, isLoading } = useClientQuery(clientId)

  if (isLoading) {
    return <Loader />
  }

  if (!clientData) {
    return <Typography>Data klienta nenačtena.</Typography>
  }

  const earnedMoneyPerClient = clientData.visits.reduce((prev, curr) => prev + Number(curr.paidPrice), 0)
  const visitCount = clientData.visits.length

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4} padding={0}>
        <DetailColumn label="Jméno a příjmení" input={`${clientData.firstName} ${clientData.lastName}`} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label="Telefon" input={clientData.phone} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label="Tržby celkem" input={formatToCZK(earnedMoneyPerClient)} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label="Náštěvy v půl roce" input={visitCount} />
      </Grid>
      <Grid size={8} alignContent="center" justifyContent="center">
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
          <BoxIcon
            href={`sms:+420${clientData.phone}`}
            size="medium"
            icon={<SmsOutlinedIcon fontSize="small" color="info" />}
            boxColor="info.light"
          />
          <AddOrUpdateClientItemButton
            defaultValues={{ firstName: clientData.firstName, lastName: clientData.lastName, phone: clientData.phone }}
            openButton={<BoxIcon size="medium" icon={<EditOutlinedIcon fontSize="small" color="secondary" />} />}
            clientId={clientData.id}
          />
          {/* <BoxIcon
            size="medium"
            icon={<DeleteOutlineOutlinedIcon fontSize="small" color="primary" />}
            boxColor="primary.light"
          /> */}
          <BoxIcon
            size="medium"
            icon={<PhoneInTalkOutlinedIcon fontSize="small" color="success" />}
            boxColor="success.light"
            href={`tel:+420${clientData.phone}`}
          />
        </Stack>
      </Grid>
    </Grid>
  )
}

export default ClientProfileGrid
