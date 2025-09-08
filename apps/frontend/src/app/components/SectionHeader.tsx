import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, IconButton } from '@mui/material'
import { type CurrentRoute } from '../../routes/AppRoutes'

const SectionHeader = (props: {
  onGoBack: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  routeAppendix: string
  route: CurrentRoute
}) => {
  const { onGoBack, routeAppendix, route } = props

  if (!route) {
    onGoBack()
    return
  }

  return (
    <Box bgcolor="#c81f5b">
      <Stack
        direction="row"
        bgcolor="#f6f6f6"
        padding={1}
        borderRadius="15px 15px 0 0"
        alignItems="center"
        justifyContent="space-between">
        <IconButton onClick={(e) => onGoBack(e)} sx={{ flexShrink: 0 }}>
          <ArrowBackIcon fontSize="medium" />
        </IconButton>

        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
            }}>
            {route.breadcrumb}
          </Typography>
          {routeAppendix && (
            <Typography
              color="secondary.main"
              sx={{
                fontSize: '15px',
                fontWeight: 600,
                paddingLeft: '3px',
              }}>
              - {routeAppendix}
            </Typography>
          )}
        </Stack>
        <Box sx={{ width: 40 }} />
      </Stack>
    </Box>
  )
}

export default SectionHeader
