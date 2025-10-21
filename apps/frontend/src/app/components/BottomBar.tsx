import Stack from '@mui/material/Stack'
import { useUserDataQuery } from '../../queries'
import AddEditClientFormDialog from '../../hairdresser/client/components/AddEditClientFormDialog'
import AddServiceItemButton from '../../hairdresser/service/components/AddServiceItemButton'
import { StockItemDialog } from '../../hairdresser/stock/components/StockItemDialog'
import AddVisitFormDialog from '../../hairdresser/visits/components/AddVisitFormDialog'
import MenuIconButton from './MenuBoxIcon'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import { useIntl } from 'react-intl'

const BottomBar = () => {
  const { data: userData } = useUserDataQuery()
  const intl = useIntl()

  const paddingX = '10px'
  const paddingY = '12px'
  const colorScheme = userData?.colorScheme ?? '#c81f5b'

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
        bgcolor: `${colorScheme}`,
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
      <AddVisitFormDialog
        openButton={
          <MenuIconButton
            icon={<MoreTimeOutlinedIcon fontSize="large" />}
            title={intl.formatMessage({ defaultMessage: 'Objednat', id: 'addVisit.order' })}
          />
        }
      />
      <StockItemDialog
        formUsagePurpose="purchaseAndNewStockItem"
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
