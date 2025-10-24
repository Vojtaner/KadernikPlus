import { ListItem, ListItemIcon, Typography } from '@mui/material';
import type { ReactElement } from 'react';

export const IconListItem = (props: { message: string; icon: ReactElement }) => {
  return (
    <ListItem>
      <ListItemIcon sx={{ minWidth: 24 }}>{props.icon}</ListItemIcon>
      <Typography variant="body2">{props.message}</Typography>
    </ListItem>
  );
};
