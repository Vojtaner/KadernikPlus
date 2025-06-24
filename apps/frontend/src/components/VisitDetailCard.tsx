import { IconButton, Paper, Stack, Typography } from '@mui/material'
import DetailColumn from './DetailColumn'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'

const VisitDetailCard = () => {
  return (
    <Paper
      sx={{
        boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.12)',
      }}>
      <Stack direction={'row'} sx={{ padding: 1 }} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h6" sx={{ padding: 1 }} color="primary">
          1.
        </Typography>
        <DetailColumn label="Datum" input="12.3.2025" />
        <DetailColumn label="Section" input="1230,00 Kč" />
        <IconButton>
          <PhotoCameraFrontOutlinedIcon fontSize="large" color="primary" />
        </IconButton>
      </Stack>
    </Paper>
  )
}

export default VisitDetailCard
