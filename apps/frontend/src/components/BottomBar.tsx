import Stack from '@mui/material/Stack'
import { AddBuyStockItemButton } from './AddBuyStockItemButton'
import AddClientItemButton from './AddClientItemButton'
import { AddVisitItemButton } from './AddVisitItemButton'
import AddWarehouseItemButton from './AddWarehouseItemButton'

const BottomBar = () => {
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack
      display="flex"
      direction={'row'}
      zIndex={1200}
      spacing={1}
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.text.disabled}`,
        bgcolor: 'white',
        paddingX,
        paddingY,
        height: '8vh',
        position: 'sticky',
        bottom: 'env(safe-area-inset-bottom)',
      }}>
      <AddBuyStockItemButton />
      <AddClientItemButton />
      <AddVisitItemButton />
      <AddWarehouseItemButton />
    </Stack>
  )
}

export default BottomBar
