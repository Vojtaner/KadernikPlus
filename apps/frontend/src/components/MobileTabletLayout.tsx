import Stack from '@mui/material/Stack'
import BottomBar from './BottomBar'
import SectionHeader from './SectionHeader'
import TopBar from './TopBar'
import { useState, type PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import { SideMenu } from './SideMenu'
import SearchResults from '../pages/SearchResults'

export const MobileTabletLayout = (props: PropsWithChildren) => {
  const { children } = props
  const [isSearchActive, setIsSearchActive] = useState(false)

  const onActiveSearch = () => {
    setIsSearchActive((prev) => !prev)
  }

  return (
    <Stack spacing={isSearchActive ? 1 : 0}>
      <Stack
        sx={{
          position: 'sticky',
          top: 0,
          width: '100%',
        }}
        borderRadius="15px 15px 0 0"
        spacing={0.5}>
        <TopBar onActiveSearch={onActiveSearch} isSearchActive={isSearchActive} />
        {!isSearchActive && <SectionHeader />}
      </Stack>
      <Box
        paddingX="10px"
        paddingY="12px"
        bgcolor="white"
        marginTop="-1px"
        borderRadius={isSearchActive ? '15px 15px 0 0' : 'none'}
        sx={{ bgcolor: 'white', height: '100%', minHeight: '100vh' }}>
        {!isSearchActive ? children : <SearchResults />}
      </Box>
      <BottomBar />
      <SideMenu />
    </Stack>
  )
}
