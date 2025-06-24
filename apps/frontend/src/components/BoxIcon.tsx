import { Box } from '@mui/material'
import type { AppPaletteColorString } from '../entity'

export type BoxIconProps = {
  icon: React.ReactNode
  boxColor?: AppPaletteColorString
  sx?: object
  size?: number
  key?: string | number
  onClick?: () => void
}

const BoxIcon = (props: BoxIconProps) => {
  const { boxColor = 'primary.light', sx, icon, size = 20, onClick, key } = props

  return (
    <Box
      key={key}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.12)',
        ...sx,
      }}
      bgcolor={boxColor}
      width={size}
      height={size}
      onClick={onClick}>
      {icon}
    </Box>
  )
}

export default BoxIcon
