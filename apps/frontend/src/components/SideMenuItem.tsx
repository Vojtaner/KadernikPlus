import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import type { AppRoutePath } from '../routes/AppRoutes'
import AppTheme from '../AppTheme'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { setCurrentLocationAppendix } from '../store/appUiSlice'

type SideMenuListItemProps = {
  title: string
  to: AppRoutePath | string
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  icon: React.JSX.Element
  isActive?: boolean
  disabled?: boolean
}

const SideMenuButton = (props: SideMenuListItemProps) => {
  const { title, to, icon, isActive = false, disabled = false, onClick } = props
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <ListItem disablePadding sx={isActive ? { bgcolor: AppTheme.palette.primary.main, fontWeight: 700 } : {}}>
      <ListItemButton
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e)
          dispatch(setCurrentLocationAppendix(''))
          navigate(to)
        }}
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
