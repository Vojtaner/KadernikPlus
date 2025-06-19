import { IconButton, Typography } from '@mui/material'
import { Check } from '@mui/icons-material'

const MenuIconButton = () => {
  return (
    <IconButton
      aria-label="menu"
      sx={{
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
        gap: 0.5,
      }}>
      <Check fontSize="large" />
      <Typography variant="caption" component="span">
        Menu
      </Typography>
    </IconButton>
  )
}

export default MenuIconButton
