import Stack from '@mui/material/Stack'
import { AddBuyStockItemButton } from './AddBuyStockItemButton'
import AddOrUpdateClientItemButton from './AddOrUpdateClientItemButton'
import { AddVisitItemButton } from './AddVisitItemButton'
import AddStockItemButton from './AddStockItemButton'
import AddServiceItemButton from './AddServiceItemButton'
import MenuIconButton from './MenuIconButton'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'

const BottomBar = () => {
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack
      display="flex"
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
      boxShadow={'0px -4px 19px 10px rgba(0,0,0,0.15)'}
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.text.disabled}`,
        bgcolor: '#c81f5b',
        paddingX,
        paddingY,
        height: '8vh',
        position: 'sticky',
        bottom: 'env(safe-area-inset-bottom)',
      }}>
      <AddServiceItemButton />
      <AddBuyStockItemButton />
      <AddOrUpdateClientItemButton
        openButton={<MenuIconButton icon={<PersonAddAlt1OutlinedIcon fontSize="large" />} title="Přidat klienta" />}
      />
      <AddVisitItemButton />
      <AddStockItemButton />
    </Stack>
  )
}

export default BottomBar
