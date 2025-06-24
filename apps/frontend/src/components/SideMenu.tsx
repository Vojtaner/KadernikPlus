import { Box, IconButton, Divider, Drawer, Stack } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { AppRoutes, isActiveRoute } from '../routes/AppRoutes'
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
import { getPathNameWithOutSlash, useTypedLocation } from '../routes/reactRouter'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'

export const SideMenu = () => {
  const isDrawerOpen = useSelector((state: RootState) => state.appUi.isDrawerOpen)
  const dispatch = useDispatch()

  const handleDrawerToggle = (open: boolean) => () => {
    // ... (keyboard event check)
    if (open) {
      dispatch(toggleDrawer())
    } else {
      dispatch(setDrawerOpen(open))
    }
  }

  const handleLanguageChange = (lang: AppLanguage) => {
    dispatch(setLanguage(lang))
    dispatch(setDrawerOpen(false)) // Close drawer after language change
  }

  const currentLanguage = useSelector((state: RootState) => state.appUi.language)
  const intl = useIntl()
  const { pathname } = useTypedLocation()
  const pathNameTransformed = getPathNameWithOutSlash(pathname)[0]

  console.log({ pathNameTransformed, AppRoutes })

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
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.MyProfile)}
        to={AppRoutes.MyProfile}
        title={intl.formatMessage({ id: 'myProfile' })}
        icon={<Face4Icon />}
      />
      <Divider />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.Dashboard)}
        to={AppRoutes.Dashboard}
        title={intl.formatMessage({ id: 'dashboard' })}
        icon={<DashboardIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.VisitsList)}
        to={AppRoutes.VisitsList}
        title={intl.formatMessage({ id: 'visitsList' })}
        icon={<PhotoCameraFrontOutlinedIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.Sms)}
        to={AppRoutes.Sms}
        title={intl.formatMessage({ id: 'sms' })}
        icon={<SmsOutlinedIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.ShoppingList)}
        to={AppRoutes.ShoppingList}
        title={intl.formatMessage({ id: 'shoppingList' })}
        icon={<ProductionQuantityLimitsIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.Consumption)}
        to={AppRoutes.Consumption}
        title={intl.formatMessage({ id: 'consumption' })}
        icon={<ContentCutIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.PriceList)}
        to={AppRoutes.PriceList}
        title={intl.formatMessage({ id: 'pricing' })}
        icon={<LocalOfferIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.Logs)}
        to={AppRoutes.Logs}
        title={intl.formatMessage({ id: 'logs' })}
        icon={<LightbulbOutlineIcon />}
      />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.Warehouse)}
        to={AppRoutes.Warehouse}
        title={intl.formatMessage({ id: 'stock' })}
        icon={<WarehouseIcon />}
      />
      <Divider />
      <SideMenuButton
        isActive={isActiveRoute(pathNameTransformed, AppRoutes.MyProfile)}
        onClick={() => {
          return handleLanguageChange(currentLanguage === 'cs' ? 'en' : 'cs')
        }}
        to={AppRoutes.Dashboard}
        title={intl.formatMessage(
          { id: 'currentLanguage', defaultMessage: `Language: ${currentLanguage.toUpperCase()}` },
          { lang: currentLanguage }
        )}
        icon={<LanguageIcon />}
      />
    </Stack>
  )

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle(false)}>
      {drawerList}
    </Drawer>
  )
}
