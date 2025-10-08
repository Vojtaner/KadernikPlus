import Stack from '@mui/material/Stack'
import BottomBar from '../app/components/BottomBar'
import TopBar from './TopBar'
import { useState, type PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import SearchResults from '../hairdresser/pages/SearchResults'
import SectionHeader from '../app/components/SectionHeader'
import AddVisitFormDialog from '../hairdresser/visits/components/AddVisitFormDialog'
import AddEditClientFormDialog from '../hairdresser/client/components/AddEditClientFormDialog'
import { StockItemDialog } from '../hairdresser/stock/components/StockItemDialog'
import MenuIconButton from '../app/components/MenuBoxIcon'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { useIntl } from 'react-intl'
import { useCurrentRoute } from '../routes/AppRoutes'
import { useAppNavigate } from '../hooks'
import { useAppSelector } from '../store/store'
import SideMenu from './SideMenu'
import AddServiceItemButton from '../hairdresser/service/components/AddServiceItemButton'
import { APP_LAYOUT_WIDTH } from './entity'
import { useUserDataQuery } from '../queries'

const Layout = (props: PropsWithChildren) => {
  const { children } = props
  const [isSearchActive, setIsSearchActive] = useState(false)
  const intl = useIntl()
  const { data: userData } = useUserDataQuery()

  const route = useCurrentRoute()
  const navigate = useAppNavigate()
  const routeAppendix = useAppSelector((state) => state.appUi.currentLocationAppendix)

  const onActiveSearch = (state: boolean) => {
    setIsSearchActive(state)
  }

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
        <TopBar onActiveSearch={onActiveSearch} isSearchActive={isSearchActive} />
        {!isSearchActive && <SectionHeader onGoBack={() => navigate(-1)} route={route} routeAppendix={routeAppendix} />}
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
          {isSearchActive && <SearchResults isSearchActive={isSearchActive} onActiveSearch={onActiveSearch} />}
        </>
      </Box>
      <BottomBar>
        <AddServiceItemButton
          openButton={
            <MenuIconButton
              icon={<ContentCutIcon fontSize="large" />}
              title={intl.formatMessage({ defaultMessage: 'Přidat službu', id: 'serviceDialog.addService' })}
            />
          }
        />
        <AddEditClientFormDialog
          openButton={
            <MenuIconButton
              icon={<PersonAddAlt1OutlinedIcon fontSize="large" />}
              title={intl.formatMessage({ defaultMessage: 'Přidat klienta', id: 'clientDialog.addClient' })}
            />
          }
        />
        <AddVisitFormDialog />
        <StockItemDialog
          formUsagePurpose="purchaseAndNewStockItem"
          openButton={
            <MenuIconButton
              icon={<WarehouseIcon fontSize="large" />}
              title={intl.formatMessage({ defaultMessage: 'Přidat materiál', id: 'stock.addStockItem' })}
            />
          }
        />
      </BottomBar>
      <SideMenu />
    </Stack>
  )
}

export default Layout
