import { Divider, Stack, Typography } from '@mui/material'
import ClientProfileGrid from '../components/ClientProfileGrid'
import VisitDetailCard from '../components/VisitDetailCard'
import { useClientQuery } from '../queries'
import { useParams } from 'react-router-dom'
import Loader from '../pages/Loader'
import { formatToCZK } from './VisitDetailGrid'
import { getDateTime } from './VisitsList'
import BoxIcon from '../components/BoxIcon'
import AddOrUpdateClientItemButton from '../components/FormDialog/AddOrUpdateClientItemButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'

const ClientProfile = () => {
  const { clientId } = useParams()
  const { data: clientData, isLoading } = useClientQuery(clientId)

  if (isLoading) {
    return <Loader />
  }

  if (!clientData) {
    return <Typography>Data klienta nenačtena.</Typography>
  }
  
  return (
    <Stack spacing={2}>
      <ClientProfileGrid clientData={clientData} />

      <Divider />
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
        <BoxIcon
          href={`sms:+420${clientData.phone}`}
          size="medium"
          icon={<SmsOutlinedIcon fontSize="small" color="info" />}
          boxColor="info.light"
        />
        <AddOrUpdateClientItemButton
          defaultValues={{
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            phone: clientData.phone,
            note: clientData.note,
          }}
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
      <Divider />

      {clientData.visits.map((visit, index) => {
        return (
          <VisitDetailCard
            visitId={visit.id}
            date={getDateTime(visit.date)}
            index={index + 1}
            key={index}
            paidPrice={formatToCZK(Number(visit.paidPrice))}
          />
        )
      })}
    </Stack>
  )
}
export default ClientProfile
