import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import type { AppRoutePath } from '../../routes/AppRoutes';
import AppTheme from '../../AppTheme';
import { useAppDispatch } from '../../store/store';
import { setCurrentLocationAppendix } from '../../store/appUiSlice';
import { useAppNavigate } from '../../hooks';
import type { ReactNode } from 'react';
import { useUserDataQuery } from '../../queries';

type SideMenuListItemProps = {
  title: string;
  to: AppRoutePath | undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  icon: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
};

const SideMenuButton = (props: SideMenuListItemProps) => {
  const { title, to, icon, isActive = false, disabled = false, onClick } = props;
  const navigate = useAppNavigate();
  const dispatch = useAppDispatch();
  const { data: userData } = useUserDataQuery();
  const colorScheme = userData?.colorScheme ?? AppTheme.palette.primary.main;

  return (
    <ListItem disablePadding sx={isActive ? { bgcolor: colorScheme, fontWeight: 700 } : {}}>
      <ListItemButton
        disabled={disabled}
        onClick={e => {
          onClick?.(e);
          dispatch(setCurrentLocationAppendix(''));
          navigate(to ?? '/');
        }}
        sx={
          isActive
            ? {
                color: 'common.white',
                '& .MuiListItemIcon-root': { color: 'common.white' },
              }
            : {}
        }
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default SideMenuButton;
