import { Grid } from '@mui/material'
import DetailColumn from './DetailColumn'
import { formatToCZK } from '../pages/VisitDetailGrid'
import type { ClientWithVisits } from '../../../entities/client'
import Note from './Note'
import { useCreateNewOrUpdateClientMutation } from '../queries'
import RedSwitch from './RedSwitch'
type ClientProfileGridProps = {
  clientData: ClientWithVisits
}

const ClientProfileGrid = (props: ClientProfileGridProps) => {
  const { clientData } = props
  const earnedMoneyPerClient = clientData.visits.reduce((prev, curr) => prev + Number(curr.paidPrice), 0)
  const visitCount = clientData.visits.length
  const { mutate: changeClientDepositStatus } = useCreateNewOrUpdateClientMutation()

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
        <DetailColumn label="Náštěvy celkem" input={visitCount} />
      </Grid>
      <Grid size={4} alignContent="center" justifyContent="center">
        <Note note={clientData.note} />
      </Grid>
      <Grid size={4} alignContent="center" justifyContent="center">
        <DetailColumn
          label="Platí zálohy"
          input={
            <RedSwitch
              checked={clientData.deposit}
              onSubmitEndpoint={(checked) => {
                changeClientDepositStatus({ deposit: checked, id: clientData.id })
              }}
            />
          }
        />
      </Grid>
    </Grid>
  )
}

export default ClientProfileGrid
