import { Grid, Typography } from '@mui/material'
import DetailColumn from '../components/DetailColumn'
import { useParams } from 'react-router-dom'
import { useVisitStatusMutation } from '../queries'
import Loader from './Loader'
import { getDateTime } from './VisitsList'
import Switch from './SwitchButton'
import type { VisitWithServices } from '../../../entities/visit'

type VisitDetailGridProps = {
  visitData: VisitWithServices | undefined
}
const VisitDetailGrid = (props: VisitDetailGridProps) => {
  const { visitData } = props
  const { visitId } = useParams()
  const { mutate: changeVisitStatus } = useVisitStatusMutation()

  if (!visitData) {
    return <Loader />
  }

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4}>
        <DetailColumn label={'Kadeřnice'} input={visitData.userId?.slice(-6)} />
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
        <DetailColumn
          label={'Uzavřeno'}
          input={
            <Switch
              checked={visitData.visitStatus}
              onSubmitEndpoint={(checked) => {
                changeVisitStatus({ status: checked, visitId })
              }}
            />
          }
        />
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
