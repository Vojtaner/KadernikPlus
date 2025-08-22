import Stack from '@mui/material/Stack'
import AddEditClientFormDialog from './FormDialogs/AddEditClientFormDialog'
import AddVisitFormDialog from './FormDialogs/AddVisitFormDialog'
import AddStockItemButton from './FormDialogs/AddEditBuyStockItemButton'
import AddServiceItemButton from './FormDialogs/AddServiceItemButton'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import MenuIconButton from './MenuIconButton'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { useIntl } from 'react-intl'

const BottomBar = () => {
  const intl = useIntl()
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
      <AddServiceItemButton
        openButton={
          <MenuIconButton
            icon={<ContentCutIcon fontSize="large" />}
            title={intl.formatMessage({ defaultMessage: 'Přidat službu', id: 'serviceDialog.addService' })}
          />
        }
      />
      <AddEditClientFormDialog
        openButton={
          <MenuIconButton
            icon={<PersonAddAlt1OutlinedIcon fontSize="large" />}
            title={intl.formatMessage({ defaultMessage: 'Přidat klienta', id: 'clientDialog.addClient' })}
          />
        }
      />
      <AddVisitFormDialog />
      <AddStockItemButton
        formUsage="purchaseAndNewStockItem"
        openButton={
          <MenuIconButton
            icon={<WarehouseIcon fontSize="large" />}
            title={intl.formatMessage({ defaultMessage: 'Přidat materiál', id: 'stock.addStockItem' })}
          />
        }
      />
    </Stack>
  )
}

export default BottomBar
