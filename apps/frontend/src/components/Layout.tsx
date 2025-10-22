import Stack from '@mui/material/Stack'
import BottomBar from '../app/components/BottomBar'
import TopBar from './TopBar'
import { type PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import SearchResults from '../hairdresser/pages/SearchResults'
import SectionHeader from '../app/components/SectionHeader'
import { useCurrentRoute } from '../routes/AppRoutes'
import { useAppNavigate } from '../hooks'
import { useAppSelector } from '../store/store'
import SideMenu from './SideMenu'
import { APP_LAYOUT_WIDTH } from '../hairdresser/entity'
import { useUserDataQuery } from '../queries'

const Layout = (props: PropsWithChildren) => {
  const { children } = props
  const isSearchActive = useAppSelector((state) => state.appUi.isSearchActive)
  const { data: userData } = useUserDataQuery()

  const route = useCurrentRoute()
  const navigate = useAppNavigate()
  const routeAppendix = useAppSelector((state) => state.appUi.currentLocationAppendix)

  document.body.style.background = '#f6f6f6'

  return (
    <Stack
      spacing={isSearchActive ? 1 : 0}
      sx={{ minWidth: { md: `${APP_LAYOUT_WIDTH}vw` }, bgcolor: userData?.colorScheme ?? '#c81f5b' }}
      boxShadow={'0px 0px 100px 0px rgba(0, 0, 0, 0.42)'}>
      <Stack
        sx={{
          zIndex: '1',
          position: 'sticky',
          top: 0,
          width: { md: '100%' },
        }}>
        <TopBar />
        <SectionHeader onGoBack={() => navigate(-1)} route={route} routeAppendix={routeAppendix} />
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
          <SearchResults />
        </>
      </Box>
      <BottomBar />
      <SideMenu />
    </Stack>
  )
}

export default Layout
