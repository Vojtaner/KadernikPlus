import { Box } from '@mui/material'
import type { AppPaletteColorString } from '../entity'

export type BoxIconProps = {
  icon: React.ReactNode
  boxColor?: AppPaletteColorString
  sx?: object
  size?: number
}

const BoxIcon = (props: BoxIconProps) => {
  const { boxColor = 'primary.light', sx, icon, size = 20 } = props

  return (
    <Box
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
      height={size}>
      {icon}
    </Box>
  )
}

export default BoxIcon
