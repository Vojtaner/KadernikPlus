import type { Theme } from '@emotion/react'
import { type SxProps, Stack, Box } from '@mui/material'
import { useAppNavigate } from '../../hooks'
import { useUserDataQuery } from '../../queries'
import { ROUTES } from '../../routes/AppRoutes'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import logo from '../../public/logo.png'

type AppLogoProps = { sx?: SxProps<Theme> }

export const AppLogo = (props: AppLogoProps) => {
  const { sx } = props
  const navigate = useAppNavigate()
  const { data: userData } = useUserDataQuery()

  return (
    <Stack direction="row" spacing={1} paddingY={0.2} paddingLeft="5px" alignItems="center" sx={sx}>
      <Box
        component="a"
        onClick={() => navigate(ROUTES.home.path)}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
        }}>
        <PhotoCameraFrontOutlinedIcon sx={{ color: '#f0f0f0' }} fontSize="large" />
        <div style={{ height: 'calc(100% - 40px)', overflow: 'hidden' }}>
          {userData?.colorScheme ? null : (
            <img width="100px" src={logo} style={{ marginTop: '-30px', marginBottom: '-38px' }} />
          )}
        </div>
      </Box>
    </Stack>
  )
}
