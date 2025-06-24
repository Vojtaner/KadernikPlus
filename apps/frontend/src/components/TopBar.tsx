import { Box, Stack, Typography, type SxProps, type Theme } from '@mui/material'
import MenuBox from './MenuBox'
import SearchBar from './SearchBar'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import AppTheme from '../AppTheme'

type TopBarProps = {
  onActiveSearch: () => void
  isSearchActive: boolean
}

function TopBar(props: TopBarProps) {
  const { onActiveSearch, isSearchActive } = props

  return (
    <Stack
      sx={{
        height: '10vh',

        paddingX: '10px',
        paddingY: '10px',
        paddingBottom: isSearchActive ? '0px' : '8px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        transition: 'padding-bottom 0.7s ease',
        background: `linear-gradient(
        270deg,
        rgba(227, 63, 92, 1) 0%,
        rgba(195, 54, 79, 1) 25%,
        rgba(154, 43, 63, 1) 86%,
        rgba(125, 35, 51, 1) 100%
      )`,
      }}>
      <Stack direction="column" sx={{ height: '100%', minHeight: '60px' }} spacing={1}>
        {!isSearchActive && (
          <AppLogo
            sx={{
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isSearchActive ? 'rotate(-80deg) scale(0.7)' : 'rotate(0deg) scale(1)',
              opacity: isSearchActive ? 0 : 1,
            }}
          />
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          <SearchBar onClick={onActiveSearch} isSearchActive={isSearchActive} onFocus={onActiveSearch} />
          {!isSearchActive && <MenuBox />}
        </Stack>
        {isSearchActive && (
          <TopBarFilterButtonsStack
            sx={{
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}

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

const AppLogo = (props: AppLogoProps) => {
  const { sx } = props

  return (
    <Stack direction="row" spacing={1} paddingY={0.2} paddingLeft="5px" alignItems="center" sx={sx}>
      <PhotoCameraFrontOutlinedIcon sx={{ color: '#f0f0f0' }} fontSize="medium" />
      <Typography color="common.white" variant="body2">
        Kadeřník+
      </Typography>
    </Stack>
  )
}
