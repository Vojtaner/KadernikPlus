import { IconButton, Stack, Typography } from '@mui/material'
import DetailColumn from './DetailColumn'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import Paper from './Paper'
import { Paths } from '../routes/AppRoutes'

type VisitDetailCardProps = { date: string; paidPrice: string; index: number; visitId: string; clientId: string }

const VisitDetailCard = (props: VisitDetailCardProps) => {
  const { date, index, paidPrice, visitId, clientId } = props
  return (
    <Paper>
      <Stack direction="row" sx={{ padding: 1 }} justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ padding: 1 }} color="primary">
          {`${index}.`}
        </Typography>
        <DetailColumn label="Datum" input={date} />
        <DetailColumn label="Section" input={paidPrice} />
        <IconButton href={Paths.visitDetail(clientId, visitId)}>
          <PhotoCameraFrontOutlinedIcon fontSize="large" color="primary" />
        </IconButton>
      </Stack>
    </Paper>
  )
}

export default VisitDetailCard
