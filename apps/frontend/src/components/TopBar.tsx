import { Box, Stack, Typography, type SxProps, type Theme } from '@mui/material'
import MenuBox from './MenuBox'
import SearchBar from './SearchBar'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import AppTheme from '../AppTheme'
import { useState } from 'react'
import { AppRoutes } from '../routes/AppRoutes'

type TopBarProps = {
  onActiveSearch: (state: boolean) => void
}

function TopBar(props: TopBarProps) {
  const { onActiveSearch } = props
  const [searchActive, setSearchActive] = useState(false)

  return (
    <Stack
      sx={{
        height: '100px',
        paddingX: '10px',
        paddingY: '10px',
        paddingBottom: searchActive ? '0px' : '8px',
        position: 'sticky',
        overflow: 'hidden',
        top: 0,
        zIndex: 1100,
        transition: 'padding-bottom 0.7s ease',
        background: '#c81f5b',
      }}>
      <Stack direction="column" spacing={1}>
        <AppLogo
          sx={{
            transform: `${searchActive ? 'translateY(-120%)' : 'translateY(0)'}`,
            transition: 'transform 0.5s ease-in-out',
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            transform: `${searchActive ? 'translateY(-90%)' : 'translateY(0)'}`,
            transition: 'transform 0.5s ease-in-out',
            position: 'relative',
          }}>
          <SearchBar
            isActive={searchActive}
            onToggleActive={(state) => {
              setSearchActive(state)
              onActiveSearch(state)
            }}
          />
          <MenuBox />
          <TopBarFilterButtonsStack
            sx={{
              transform: `${!searchActive ? 'translateX(-160%)' : 'translateX(0)'}`,
              transition: 'transform 0.5s ease-in-out',
              position: 'absolute',
              top: '45px',
              left: '0px',
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

//  <Stack
//                     gap={2}
//                     direction={'row'}
//                     sx={{
//                       transform: `${!active ? 'translateX(120%)' : 'translateX(0)'}`,
//                       transition: 'transform 0.5s ease-in-out',
//                     }}>
//                     <Box sx={{ width: '20%', height: '30px', backgroundColor: 'pink' }} />
//                     <Box sx={{ width: '20%', height: '30px', backgroundColor: 'pink' }} />
//                     <Box sx={{ width: '20%', height: '30px', backgroundColor: 'pink' }} />
//                     <Box sx={{ width: '20%', height: '30px', backgroundColor: 'pink' }} />
//                     <Box sx={{ width: '20%', height: '30px', backgroundColor: 'pink' }} />
//                   </Stack>
//                 </Stack>

export default TopBar

type TopBarFilterButtonsStackProps = {
  sx: SxProps<Theme>
}

const TopBarFilterButtonsStack = (props: TopBarFilterButtonsStackProps) => {
  const { sx } = props

  return (
    <Stack
      sx={{ height: '100%', ...sx }}
      display="flex"
      direction="row"
      spacing={4}
      alignItems="center"
      justifyContent="flex-start">
      <TopBarFilterButton isActive={true} text="Všichni" />
      <TopBarFilterButton isActive={false} text="Pavla" />
      <TopBarFilterButton isActive={false} text="Monika" />
    </Stack>
  )
}

type TopBarFilterButtonProps = {
  isActive: boolean
  onClick?: () => void
  text: string
}

const TopBarFilterButton = (props: TopBarFilterButtonProps) => {
  const { isActive = false, onClick, text } = props

  const buttonProps = {
    bgcolor: isActive ? AppTheme.palette.common.white : '',
    borderRadius: '5px',
    color: isActive ? AppTheme.palette.primary.main : AppTheme.palette.common.white,
    paddingX: '6px',
    paddingY: '3px',
  }

  return (
    <Box {...buttonProps} onClick={onClick}>
      <Typography sx={{ minWidth: 'max-content', width: 'auto' }} fontSize="small">
        {text}
      </Typography>
    </Box>
  )
}
type AppLogoProps = { sx?: SxProps<Theme> }

export const AppLogo = (props: AppLogoProps) => {
  const { sx } = props

  return (
    <Stack direction="row" spacing={1} paddingY={0.2} paddingLeft="5px" alignItems="center" sx={sx}>
      <Box
        component="a"
        href={AppRoutes.Dashboard}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
        }}>
        <PhotoCameraFrontOutlinedIcon sx={{ color: '#f0f0f0' }} fontSize="large" />
        <div style={{ height: 'calc(100% - 40px)', overflow: 'hidden' }}>
          <img
            width="100px"
            src="../../public/assets/logofornow.png"
            style={{ marginTop: '-30px', marginBottom: '-38px' }}
          />
        </div>
      </Box>
    </Stack>
  )
}
