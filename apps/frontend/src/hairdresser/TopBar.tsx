import { Box, Button, Stack, type SxProps, type Theme } from '@mui/material'
import MenuBox from '../app/components/MenuBox'
import SearchBar from '../app/components/SearchBar'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { ROUTES } from '../routes/AppRoutes'
import logo from '../../public/assets/logofornow.png'
import { useAppNavigate } from '../hooks'
import { useDispatch } from 'react-redux'
import { toggleDrawer } from '../store/appUiSlice'
import AppTheme from '../AppTheme'

type TopBarProps = {
  onActiveSearch: (state: boolean) => void
  isSearchActive: boolean
}

const TopBar = (props: TopBarProps) => {
  const { onActiveSearch, isSearchActive } = props
  const dispatch = useDispatch()

  return (
    <Stack
      sx={{
        height: '100px',
        paddingX: '10px',
        position: 'sticky',
        overflow: 'hidden',
        paddingY: '10px',
        paddingBottom: isSearchActive ? '0px' : '8px',
        top: 0,
        transition: 'padding-bottom 0.7s ease',
        background: '#c81f5b',
      }}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={2}>
          <AppLogo
            sx={{
              transform: `${isSearchActive ? 'translateY(-120%)' : 'translateY(0)'}`,
              transition: 'transform 0.5s ease-in-out',
            }}
          />
          <Button
            href="https://www.kadernikplus.cz/video-navody"
            sx={{ bgcolor: AppTheme.palette.info.main }}
            variant="contained">
            Video návody
          </Button>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            transform: `${isSearchActive ? 'translateY(-90%)' : 'translateY(0)'}`,
            transition: 'transform 0.5s ease-in-out',
            position: 'relative',
          }}>
          <SearchBar
            isActive={isSearchActive}
            onToggleActive={(state) => {
              onActiveSearch(state)
              onActiveSearch(state)
            }}
          />
          <MenuBox onClick={() => dispatch(toggleDrawer())} />
          {/* <TopBarFilterButtonsStack
            sx={{
              transform: `${!isSearchActive ? 'translateX(-160%)' : 'translateX(0)'}`,
              transition: 'transform 0.5s ease-in-out',
              position: 'absolute',
              top: '45px',
              left: '0px',
            }}
          /> */}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TopBar

// type TopBarFilterButtonsStackProps = {
//   sx: SxProps<Theme>
// }

// const TopBarFilterButtonsStack = (props: TopBarFilterButtonsStackProps) => {
//   const { sx } = props

//   return (
//     <Stack
//       sx={{ height: '100%', ...sx }}
//       display="flex"
//       direction="row"
//       spacing={4}
//       alignItems="center"
//       justifyContent="flex-start">
//       <TopBarFilterButton isActive={true} text="Všichni" />
//       <TopBarFilterButton isActive={false} text="Pavla" />
//       <TopBarFilterButton isActive={false} text="Monika" />
//     </Stack>
//   )
// }

// type TopBarFilterButtonProps = {
//   isActive: boolean
//   onClick?: () => void
//   text: string
// }

// const TopBarFilterButton = (props: TopBarFilterButtonProps) => {
//   const { isActive = false, onClick, text } = props

//   const buttonProps = {
//     bgcolor: isActive ? AppTheme.palette.common.white : '',
//     borderRadius: '5px',
//     color: isActive ? AppTheme.palette.primary.main : AppTheme.palette.common.white,
//     paddingX: '6px',
//     paddingY: '3px',
//   }

//   return (
//     <Box {...buttonProps} onClick={onClick}>
//       <Typography sx={{ minWidth: 'max-content', width: 'auto' }} fontSize="small">
//         {text}
//       </Typography>
//     </Box>
//   )
// }
type AppLogoProps = { sx?: SxProps<Theme> }

export const AppLogo = (props: AppLogoProps) => {
  const { sx } = props
  const navigate = useAppNavigate()

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
          <img width="100px" src={logo} style={{ marginTop: '-30px', marginBottom: '-38px' }} />
        </div>
      </Box>
    </Stack>
  )
}
