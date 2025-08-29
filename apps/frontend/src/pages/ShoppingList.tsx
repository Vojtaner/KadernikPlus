import { Box } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import { type GridColDef } from '@mui/x-data-grid'
import { useStockItemsQuery, useStocksQuery } from '../queries'
import type { StockItem } from '../entities/stock-item'
import Loader from './Loader'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { formatToCZK } from './VisitDetailGrid'
import { StockItemDialog } from '../components/FormDialogs/StockItemDialog'

type ShoppingListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
}

const ShoppingList = (props: ShoppingListProps) => {
  const { columnHeaderHeight, hideFooter = false } = props
  const { data: stocks } = useStocksQuery()
  const { data: stockItems } = useStockItemsQuery(stocks ? stocks[0].id : undefined)

  if (!stockItems) {
    return <Loader />
  }
  const shoppingList = createShoppingList(stockItems)
  const shoppingListColumns = createColumns()

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid
        rows={shoppingList}
        columns={shoppingListColumns}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
      />
    </Box>
  )
}

export default ShoppingList

const createShoppingList = (stockItems: StockItem[]): ShoppingListItemType[] => {
  return stockItems.flatMap((item): ShoppingListItemType[] => {
    const threshold = Number(item.threshold)
    const avgPrice = Number(item.avgUnitPrice)
    const lastPackageQuantity = Number(item.lastPackageQuantity)
    const packageCount = Number(item.packageCount)

    const requiredPackages = threshold + 1

    if (!item.id) {
      throw new Error(`Položka ${item.itemName} nemá ID.`)
    }

    if (packageCount < requiredPackages) {
      const missingPackages = Math.round((requiredPackages - packageCount) * 100) / 100
      const missingUnits = Math.round(missingPackages * lastPackageQuantity * 100) / 100

      return [
        {
          id: item.id,
          item: item.itemName,
          price: Math.round(missingUnits * avgPrice * 100) / 100,
          amount: missingPackages,
          unit: item.unit,
        },
      ]
    }
    return []
  })
}

type ShoppingListItemType = { id: string; item: string; price: number; amount: number; unit: string }

const createColumns = (): GridColDef<ShoppingListItemType[][number]>[] => {
  return [
    { field: 'item', headerName: 'Položka', disableColumnMenu: true, minWidth: 130 },
    {
      field: 'price',
      headerName: 'Cena',
      disableColumnMenu: true,
      display: 'flex',
      minWidth: 80,
      renderCell: (params) => formatToCZK(params.row.price),
    },
    {
      field: 'amount',
      headerName: 'Množství',
      minWidth: 90,
      disableColumnMenu: true,
      renderCell: (params) => `${params.value} ks`,
    },
    {
      field: 'edit',
      headerName: '',
      width: 20,
      editable: false,
      display: 'flex',
      disableColumnMenu: true,
      renderCell: (params) => (
        <StockItemDialog
          formUsagePurpose="purchase"
          defaultValues={{
            id: params.row.id,
          }}
          openButton={
            <BoxIcon size="small" boxColor="#61fb0133" icon={<EditOutlinedIcon fontSize="small" color="success" />} />
          }
        />
      ),
    },
  ]
}
