import Stack from '@mui/material/Stack'
import BottomBar from './BottomBar'
import SectionHeader from './SectionHeader'
import TopBar from './TopBar'
import { useState, type PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import { SideMenu } from './SideMenu'
import SearchResults from '../pages/SearchResults'

const Layout = (props: PropsWithChildren) => {
  const { children } = props
  const [isSearchActive, setIsSearchActive] = useState(false)

  const onActiveSearch = () => {
    setIsSearchActive((prev) => !prev)
  }

  document.body.style.background = ` linear-gradient(
        270deg,
        rgba(227, 63, 92, 1) 0%,
        rgba(195, 54, 79, 1) 25%,
        rgb(200, 49, 77) 86%,
        rgb(202, 24, 57) 100%
      )`

  return (
    <Stack
      spacing={isSearchActive ? 1 : 0}
      sx={{ minWidth: { md: '50vw', xs: 0 } }}
      boxShadow={'0px 0px 100px 0px rgba(0, 0, 0, 0.42)'}>
      <Stack
        sx={{
          position: 'sticky',
          top: 0,
          width: { md: '100%' },
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

export default Layout
