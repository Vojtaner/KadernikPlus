import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import type { AppRoutes } from '../routes/AppRoutes'

type SideMenuListItemProps = {
  title: string
  to: (typeof AppRoutes)[keyof typeof AppRoutes]
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  icon: React.JSX.Element
}

const SideMenuButton = (props: SideMenuListItemProps) => {
  const { title, to, icon } = props

  return (
    <ListItem disablePadding>
      <ListItemButton href={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  )
}
export default SideMenuButton
