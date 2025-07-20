import { IconButton, Stack, Typography, type SxProps } from '@mui/material'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'

const SearchResult = (props: { sx?: SxProps }) => {
  const haircut = 'Stříhání suché'
  const customerName = 'Standa Novák'
  const depositState = 'Bez zálohy'
  const dateTime = '12.5.2025 - 13:45'

  return (
    <Stack
      marginY="5px"
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={1}
      sx={{ ...props.sx }}>
      <IconButton>
        <PermIdentityIcon fontSize="large" />
      </IconButton>
      <Stack justifyContent="center" height="100%">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontWeight={600} color="text.primary" fontSize={'1rem'}>
            {customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {haircut}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color={'info.main'} fontSize={'0.7rem'}>
            {depositState.toUpperCase()}
          </Typography>
          <Typography variant="h6" color={'info.main'} fontSize={'0.7rem'}>
            -
          </Typography>
          <Typography variant="caption" color={'#ff6221'} alignItems="center">
            {dateTime}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default SearchResult
