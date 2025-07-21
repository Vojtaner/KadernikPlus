import { Grid, Switch, Typography } from '@mui/material'
import DetailColumn from '../components/DetailColumn'
import { useParams } from 'react-router-dom'
import { useTeamMembersQuery, useVisitQuery } from '../queries'
import Loader from './Loader'
import { getDateTime } from './VisitsList'

const VisitDetailGrid = () => {
  const { visitId } = useParams()
  const { data: visitData } = useVisitQuery(visitId)
  const { data: teamMembers } = useTeamMembersQuery()

  if (!visitData) {
    return <Loader />
  }

  console.log({ teamMembers, visitData })

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4}>
        <DetailColumn label={'Kadeřnice'} input={'Monika L.'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={'Zaplacená cena'}
          input={formatToCZK(visitData.paidPrice)}
          helperText={formatToCZK(visitData.visitServices[0].service.basePrice)}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Datum'} input={getDateTime(visitData.date)} />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={'Stav zálohy'}
          input={
            <Typography textTransform={'uppercase'} color="info.main" fontWeight={600}>
              {visitData.depositStatus}
            </Typography>
          }
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Výše zálohy'} input={formatToCZK(visitData.deposit)} />
      </Grid>
      <Grid size={4} padding={0}>
        <DetailColumn label={'Uzavřeno'} input={<Switch checked={visitData.visitStatus} />} />
      </Grid>
    </Grid>
  )
}

export default VisitDetailGrid

export function formatToCZK(value: string | number | undefined): string {
  if (!value) {
    return '0,00 Kč'
  }
  const numberValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  if (isNaN(numberValue)) {
    return ''
  }

  return numberValue.toLocaleString('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
