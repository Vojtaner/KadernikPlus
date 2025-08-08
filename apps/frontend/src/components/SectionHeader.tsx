import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, IconButton } from '@mui/material'
import { getNthPathName, getPathNameWithOutSlash, useAppLocation } from '../routes/reactRouter'
import { useAppSelector } from '../store'

const SectionHeader = () => {
  const { pathname } = useAppLocation()
  const appedix = useAppSelector((state) => state.appUi.currentLocationAppendix)
  const { pageTitle, appendix } = getNthPathName(getPathNameWithOutSlash(pathname), 0, appedix)
  console.log({ pageTitle, appedix })
  return (
    <Box bgcolor="#c81f5b">
      <Stack
        direction="row"
        bgcolor="#f6f6f6"
        padding={1}
        borderRadius="15px 15px 0 0"
        alignItems="center"
        justifyContent="space-between">
        <IconButton href="/" sx={{ flexShrink: 0 }}>
          <ArrowBackIcon fontSize="medium" />
        </IconButton>

        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
            }}>
            {pageTitle}
          </Typography>
          {appendix && (
            <Typography
              color="secondary.main"
              sx={{
                fontSize: '15px',
                fontWeight: 600,
                paddingLeft: '3px',
              }}>
              - {appendix}
            </Typography>
          )}
        </Stack>
        <Box sx={{ width: 40 }} />
      </Stack>
    </Box>
  )
}

export default SectionHeader
