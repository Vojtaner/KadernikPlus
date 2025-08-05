import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import { useDispatch } from 'react-redux'
import { toggleDrawer } from '../store/appUiSlice'
import type { SxProps } from '@mui/material'

const MenuBox = (props: { sx?: SxProps }) => {
  const dispatch = useDispatch()

  return (
    <Box
      onClick={() => {
        dispatch(toggleDrawer())
      }}
      sx={{
        width: 48,
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        bgcolor: '#140f1124',
        borderRadius: '10px',
        justifyContent: 'center',
        ...props.sx,
      }}>
      <MenuIcon fontSize="large" sx={{ color: '#f0f0f0' }} />
    </Box>
  )
}

export default MenuBox
