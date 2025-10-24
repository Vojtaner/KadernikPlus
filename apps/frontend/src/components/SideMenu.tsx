import { Box, IconButton, Drawer, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector, type RootState } from '../store/store';
import { toggleDrawer } from '../store/appUiSlice';
import CloseIcon from '@mui/icons-material/Close';
import { useIntl } from 'react-intl';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppLocation } from '../routes/reactRouter';
import { usePersistentFilters } from '../hooks';
import { getMenuItems, SideMenuList } from '../app/components/SideMenuList';
import { useStocksQuery } from '../hairdresser/stock/queries';
import { useTeamMemberQuery } from '../hairdresser/team/queries';

const SideMenu = () => {
  const isOpen = useAppSelector((state: RootState) => state.appUi.isDrawerOpen);
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { data: teamMember } = useTeamMemberQuery();
  const { data: stocks } = useStocksQuery();
  const [filters, updateFilters] = usePersistentFilters();
  const { logout } = useAuth0();
  const location = useAppLocation();

  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  const toggleLanguage = () => {
    updateFilters(draft => {
      draft.language = filters.language === 'cs' ? 'en' : 'cs';
    });
    dispatch(toggleDrawer());
  };

  const menuItems = getMenuItems(intl, teamMember, stocks, filters, toggleLanguage, () =>
    logout({ logoutParams: { returnTo: window.location.origin } })
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={handleDrawerToggle}>
      <Stack sx={{ width: 250 }} role="presentation">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
          <IconButton onClick={handleDrawerToggle} aria-label="close drawer">
            <CloseIcon />
          </IconButton>
        </Box>
        <SideMenuList items={menuItems} onClose={handleDrawerToggle} location={location} />
      </Stack>
    </Drawer>
  );
};

export default SideMenu;
