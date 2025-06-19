import { Check } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const MobileTabletLayout = () => {
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <Stack
        sx={{
          height: '10vh',
          paddingX,
          paddingY,
        }}>
        <Stack direction={'column'} sx={{ height: '100%', minHeight: '60px' }}>
          <Stack direction={'row'} sx={{ height: '100%' }} spacing={1}>
            <Stack
              direction={'row'}
              sx={{ flex: 85, bgcolor: '#ffffff38', borderRadius: '10px' }}
              justifyContent={'space-between'}>
              <Typography
                alignContent={'center'}
                color="#f0f0f0"
                sx={{
                  textAlign: 'left',
                  paddingY: 1,
                  paddingX: 2,
                }}>
                Vyhledej zákazníka...
              </Typography>
              <Box
                sx={{
                  width: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <SearchIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
              </Box>
            </Stack>
            <Box
              sx={{
                width: 48,
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#ffffff38',
                borderRadius: '10px',
                justifyContent: 'center',
              }}>
              <MenuIcon fontSize="large" sx={{ color: '#f0f0f0' }} />
            </Box>
          </Stack>
          <Stack
            sx={{ height: '100%' }}
            display="flex"
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <Typography sx={{ flex: 1, color: 'white' }}>Ahoj</Typography>
            <Typography sx={{ flex: 1, color: 'white' }}>Ahoj</Typography>
            <Typography sx={{ flex: 1, color: 'white' }}>Ahoj</Typography>
            <Typography sx={{ flex: 1, color: 'white' }}>Ahoj</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          bgcolor: 'white',
          paddingX,
          paddingY,
          borderRadius: '15px 15px 0 0',
          flex: 1,
        }}>
        <Stack>
          <Stack
            direction={'row'}
            sx={{
              position: 'relative',
            }}
            alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingX: '10px',
                paddingY: '10px',
              }}>
              <ArrowBackIcon fontSize="medium" />
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
              Přehled
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        display="flex"
        direction={'row'}
        spacing={1}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.text.disabled}`,
          bgcolor: 'white',
          paddingX,
          paddingY,
          height: '8vh',
        }}>
        <MenuIconButton />
        <MenuIconButton />
        <MenuIconButton />
        <MenuIconButton />
      </Stack>
    </Stack>
  )
}

export default MobileTabletLayout

const MenuIconButton = () => {
  // This would be determined by your app's state
  return (
    <IconButton
      aria-label="menu"
      sx={{
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
        gap: 0.5,
      }}>
      <Check fontSize="large" />
      <Typography variant="caption" component="span">
        Menu
      </Typography>
    </IconButton>
  )
}
