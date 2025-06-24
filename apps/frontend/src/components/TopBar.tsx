import { Box, Stack, Typography } from '@mui/material'
import MenuBox from './MenuBox'
import SearchBar from './SearchBar'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import AppTheme from '../AppTheme'
import { useState } from 'react'

function TopBar() {
  const [active, setActive] = useState(false)

  return (
    <Stack
      sx={{
        height: '11vh',
        paddingX: '10px',
        paddingY: '10px',
        paddingBottom: active ? '0px' : '8px',
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
        {!active && <AppLogo />}
        <Stack direction="row" sx={{ height: '100%' }} spacing={1}>
          <SearchBar onClick={() => setActive((prev) => !prev)} />
          <MenuBox />
        </Stack>
        {active && <TopBarFilterButtonsStack />}
      </Stack>
    </Stack>
  )
}

export default TopBar

const TopBarFilterButtonsStack = () => {
  return (
    <Stack
      sx={{ height: '100%' }}
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

const AppLogo = () => {
  return (
    <Stack direction="row" spacing={1} paddingY={0.2} paddingLeft="5px" alignItems="center">
      <PhotoCameraFrontOutlinedIcon sx={{ color: '#f0f0f0' }} fontSize="small" />
      <Typography color="common.white">Kadeřník+</Typography>
    </Stack>
  )
}
