import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import type { AppRoutePath } from '../routes/AppRoutes'
import AppTheme from '../AppTheme'

type SideMenuListItemProps = {
  title: string
  to: AppRoutePath | string
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  icon: React.JSX.Element
  isActive?: boolean
  disabled?: boolean
}

const SideMenuButton = (props: SideMenuListItemProps) => {
  const { title, to, icon, isActive = false, disabled = false } = props

  return (
    <ListItem disablePadding sx={isActive ? { bgcolor: AppTheme.palette.primary.main, fontWeight: 700 } : {}}>
      <ListItemButton
        disabled={disabled}
        href={to}
        sx={
          isActive
            ? {
                color: 'common.white',
                '& .MuiListItemIcon-root': { color: 'common.white' },
              }
            : {}
        }>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  )
}
export default SideMenuButton
