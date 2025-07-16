import { Grid, Switch, Typography } from '@mui/material'
import DetailColumn from '../components/DetailColumn'
import { useParams } from 'react-router-dom'
import { useVisitQuery } from '../queries'
import Loader from './Loader'

const VisitDetailGrid = () => {
  const { visitId } = useParams()
  const { data: visitData } = useVisitQuery(visitId)

  if (!visitData) {
    return <Loader />
  }

  console.log({ visitData })

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4}>
        <DetailColumn label={'Kadeřnice'} input={'Monika L.'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Cena'} input={'1250,00 Kč'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Datum'} input={'12.3.2025'} />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={'Stav zálohy'}
          input={
            <Typography textTransform={'uppercase'} color="info.main" fontWeight={600}>
              Bez zálohy
            </Typography>
          }
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn label={'Výše zálohy'} input={'250,00 Kč'} />
      </Grid>
      <Grid size={4} padding={0}>
        <DetailColumn label={'Uzavřeno'} input={<Switch defaultChecked />} />
      </Grid>
    </Grid>
  )
}

export default VisitDetailGrid
