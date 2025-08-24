import { Box, IconButton, Divider, Drawer, Stack } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Paths, ROUTES, useCurrentRoute } from '../routes/AppRoutes'
import type { RootState } from '../store'
import { toggleDrawer, setDrawerOpen, type AppLanguage, setLanguage } from '../store/appUiSlice'
import LanguageIcon from '@mui/icons-material/Language'
import CloseIcon from '@mui/icons-material/Close'
import { useIntl } from 'react-intl'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import LightbulbOutlineIcon from '@mui/icons-material/LightbulbOutline'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Face4Icon from '@mui/icons-material/Face4'
import SideMenuButton from './SideMenuItem'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutIcon from '@mui/icons-material/Logout'
import { useStocksQuery, useTeamMemberQuery } from '../queries'
import { useNavigate } from 'react-router-dom'
import { useAppLocation } from '../routes/reactRouter'
import { useCallback } from 'react'

export const SideMenu = () => {
  const isDrawerOpen = useSelector((state: RootState) => state.appUi.isDrawerOpen)
  const { logout } = useAuth0()
  const location = useAppLocation()
  const dispatch = useDispatch()
  const { data: teamMember } = useTeamMemberQuery()
  const { data: stocks } = useStocksQuery()

  const handleDrawerToggle = (open: boolean) => () => {
    if (open) {
      dispatch(toggleDrawer())
    } else {
      dispatch(setDrawerOpen(open))
    }
  }

  const handleLanguageChange = (lang: AppLanguage) => {
    dispatch(setLanguage(lang))
    dispatch(setDrawerOpen(false))
  }

  const currentLanguage = useSelector((state: RootState) => state.appUi.language)
  const intl = useIntl()
  const navigate = useNavigate()
  const route = useCurrentRoute()

  if (!route) {
    navigate('/')
    return
  }

  const isLocationActive = useCallback((route: string, location: string): boolean => {
    return route === location
  }, [])

  const drawerList = (
    <Stack
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle(false)}
      onKeyDown={handleDrawerToggle(false)}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
        <IconButton onClick={handleDrawerToggle(false)} aria-label="close drawer">
          <CloseIcon />
        </IconButton>
      </Box>
      <SideMenuButton
        isActive={isLocationActive(ROUTES.profile.path, location.pathname)}
        to={ROUTES.profile.path}
        title={intl.formatMessage({ id: 'myProfile', defaultMessage: 'Můj profil' })}
        icon={<Face4Icon />}
      />

      <SideMenuButton
        disabled={!teamMember}
        isActive={isLocationActive(ROUTES.team.path, location.pathname)}
        to={teamMember?.teamId ? Paths.team(teamMember.teamId) : '#'}
        title={intl.formatMessage({ id: 'team', defaultMessage: 'Tým' })}
        icon={<Face4Icon />}
      />
      <Divider />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.home.path, location.pathname)}
        to={ROUTES.home.path}
        title={intl.formatMessage({ id: 'dashboard', defaultMessage: 'Přehledy' })}
        icon={<DashboardIcon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.clients.path, location.pathname)}
        to={ROUTES.clients.path}
        title={intl.formatMessage({ id: 'clients', defaultMessage: 'Klienti' })}
        icon={<Face4Icon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.visits.path, location.pathname)}
        to={ROUTES.visits.path}
        title={intl.formatMessage({ id: 'visitsList', defaultMessage: 'Návštěvy' })}
        icon={<PhotoCameraFrontOutlinedIcon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.sms.path, location.pathname)}
        to={ROUTES.sms.path}
        title={intl.formatMessage({ id: 'sms', defaultMessage: 'SMSky' })}
        icon={<SmsOutlinedIcon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.shoppingList.path, location.pathname)}
        to={ROUTES.shoppingList.path}
        title={intl.formatMessage({ id: 'shoppingList', defaultMessage: 'Nákupní seznam' })}
        icon={<ProductionQuantityLimitsIcon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.consumption.path, location.pathname)}
        to={teamMember?.teamId ? Paths.consumption(teamMember.teamId) : '#'}
        title={intl.formatMessage({ id: 'consumption', defaultMessage: 'Spotřeba' })}
        icon={<ContentCutIcon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.services.path, location.pathname)}
        to={ROUTES.services.path}
        title={intl.formatMessage({ id: 'pricing', defaultMessage: 'Ceník' })}
        icon={<LocalOfferIcon />}
      />
      <SideMenuButton
        isActive={isLocationActive(ROUTES.logs.path, location.pathname)}
        to={ROUTES.logs.path}
        title={intl.formatMessage({ id: 'logs', defaultMessage: 'Záznamy o aktivitě' })}
        icon={<LightbulbOutlineIcon />}
      />
      {stocks && (
        <SideMenuButton
          isActive={isLocationActive(ROUTES.stock.path, location.pathname)}
          to={Paths.stock(stocks[0].id)}
          title={intl.formatMessage({ id: 'stock', defaultMessage: 'Sklad' })}
          icon={<WarehouseIcon />}
        />
      )}
      <Divider />
      <SideMenuButton
        onClick={() => {
          return handleLanguageChange(currentLanguage === 'cs' ? 'en' : 'cs')
        }}
        to={ROUTES.home.path}
        title={intl.formatMessage(
          { id: 'currentLanguage', defaultMessage: `Language: {lang}` },
          { lang: currentLanguage.toUpperCase() }
        )}
        icon={<LanguageIcon />}
      />
      <SideMenuButton
        onClick={() => {
          console.log('ahoj')
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('@@auth0spajs@@')) {
              localStorage.removeItem(key)
            }
          })
          logout({ logoutParams: { returnTo: window.location.origin } })
        }}
        to={ROUTES.home.path}
        title={intl.formatMessage({ id: 'logOut', defaultMessage: `Odhlásit se` })}
        icon={<LogoutIcon />}
      />
    </Stack>
  )

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle(false)}>
      {drawerList}
    </Drawer>
  )
}
