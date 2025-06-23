import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton } from '@mui/material'
import { breadCrumbNameMap, type AppRoutePath } from '../routes/AppRoutes'
import { useTypedLocation } from '../routes/reactRouter'

const SectionHeader = () => {
  const { pathname } = useTypedLocation()

  const pathNames: AppRoutePath[] =
    pathname === '/'
      ? [pathname]
      : pathname
          .split('/')
          .filter(Boolean)
          .filter((p): p is AppRoutePath => p in breadCrumbNameMap)

  console.log({ pathNamef: getNthPathName(pathNames, 0), pathname, pathNames })

  return (
    <Stack
      direction={'row'}
      bgcolor={'white'}
      alignItems="center"
      padding={1}
      borderRadius={'15px 15px 0 0'}
      zIndex={1300}
      marginTop={'-11px'}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <IconButton href="/">
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
      </Box>
      <Typography
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          width: 'fit-content',
          textAlign: 'center',
          paddingY: 1,
          paddingX: 2,
        }}>
        {getNthPathName(pathNames, 0)}
      </Typography>
    </Stack>
  )
}

export default SectionHeader

const getNthPathName = (pathNames: AppRoutePath[], order: number) => {
  return breadCrumbNameMap[pathNames[order]]
}
