import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import type { SxProps } from '@mui/material'

const MenuBox = (props: { sx?: SxProps; onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }) => {
  const { onClick, sx } = props

  return (
    <Box
      onClick={(e) => onClick(e)}
      sx={{
        width: 48,
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        bgcolor: '#140f1124',
        borderRadius: '10px',
        justifyContent: 'center',
        ...sx,
      }}>
      <MenuIcon fontSize="large" sx={{ color: '#f0f0f0' }} />
    </Box>
  )
}

export default MenuBox
