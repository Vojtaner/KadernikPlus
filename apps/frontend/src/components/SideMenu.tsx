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
import { toggleDrawer, setDrawerOpen } from '../store/appUiSlice'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'

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
            <ListItemText primary="Přehledy" />
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
            <ListItemText primary="Settings" />
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
