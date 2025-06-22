import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppRoutes } from '../routes/AppRoutes'
import type { RootState } from '../store'
import { toggleDrawer, setDrawerOpen, type AppLanguage, setLanguage } from '../store/appUiSlice'
import SettingsIcon from '@mui/icons-material/Settings'
import LanguageIcon from '@mui/icons-material/Language'
import CloseIcon from '@mui/icons-material/Close'
import { useIntl } from 'react-intl'

export const SideMenu: React.FC = () => {
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

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle(false)}
      onKeyDown={handleDrawerToggle(false)}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
        <IconButton onClick={handleDrawerToggle(false)} aria-label="close drawer">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={AppRoutes.HomeOverview}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'overviewsSideMenuItem' })} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={AppRoutes.VisitsList}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'visitsSideMenuItem' })} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              dispatch(setDrawerOpen(false))
            }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'settingsSideMenuItem' })} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              return handleLanguageChange(currentLanguage === 'cs' ? 'en' : 'cs')
            }}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary={intl.formatMessage(
                { id: 'currentLanguage', defaultMessage: `Language: ${currentLanguage.toUpperCase()}` },
                { lang: currentLanguage }
              )}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle(false)}>
      {drawerList}
    </Drawer>
  )
}
