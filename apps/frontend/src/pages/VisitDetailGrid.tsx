import { Grid, Switch, Typography } from '@mui/material'
import DetailColumn from '../components/DetailColumn'
import { useParams } from 'react-router-dom'
import { useVisitQuery } from '../queries'
import Loader from './Loader'
import { getDateTime } from './VisitsList'

const VisitDetailGrid = () => {
  const { visitId } = useParams()
  const { data: visitData } = useVisitQuery(visitId)

  if (!visitData) {
    return <Loader />
  }

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4}>
        <DetailColumn label={'Kadeřnice'} input={'Monika L.'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Cena'} input={formatToCZK(visitData.paidPrice)} />
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
