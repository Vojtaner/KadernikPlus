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

  const onActiveSearch = (state: boolean) => {
    setIsSearchActive(state)
  }

  document.body.style.background = '#f6f6f6'

  return (
    <Stack
      spacing={isSearchActive ? 1 : 0}
      sx={{ minWidth: { md: '30vw' }, bgcolor: '#c81f5b' }}
      boxShadow={'0px 0px 100px 0px rgba(0, 0, 0, 0.42)'}>
      <Stack
        sx={{
          zIndex: '1',
          position: 'sticky',
          top: 0,
          width: { md: '100%' },
        }}>
        <TopBar onActiveSearch={onActiveSearch} />
        {!isSearchActive && <SectionHeader />}
      </Stack>
      <Box
        paddingX="10px"
        paddingY="12px"
        bgcolor="#f6f6f6"
        marginTop="-1px"
        borderRadius={isSearchActive ? '15px 15px 0 0' : 'none'}
        sx={{ bgcolor: '#f6f6f6', height: '100%', minHeight: '100vh' }}>
        <>
          {!isSearchActive && children}
          {isSearchActive && <SearchResults isSearchActive={isSearchActive} />}
        </>
      </Box>
      <BottomBar />
      <SideMenu />
    </Stack>
  )
}

export default Layout
