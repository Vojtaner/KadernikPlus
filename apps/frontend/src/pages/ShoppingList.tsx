import { Box } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import { type GridColDef } from '@mui/x-data-grid'
import { useStockItemsQuery, useStocksQuery } from '../queries'
import type { StockItem } from '../entities/stock-item'
import Loader from './Loader'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AddEditBuyStockItemButton from '../components/FormDialogs/AddEditBuyStockItemButton'
import { formatToCZK } from './VisitDetailGrid'

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
      const missingPackages = requiredPackages - packageCount
      const missingUnits = missingPackages * lastPackageQuantity

      return [
        {
          id: item.id,
          item: item.itemName,
          price: missingUnits * avgPrice,
          amount: missingPackages,
          unit: item.unit,
        },
      ]
    }
    return []
  })
}

type ShoppingListItemType = { id: string; item: string; price: number; amount: number; unit: string }

// const rows: ShoppingListItemType[] = [
//   { id: '1', item: 'Peroxid 6%', price: 890, amount: 1000, unit: 'ml' },
//   { id: '2', item: 'Blondor Multi Blonde', price: 1450, amount: 400, unit: 'g' },
//   { id: '3', item: 'Alpecin tonikum', price: 350, amount: 200, unit: 'ml' },
//   { id: '4', item: 'Holicí pláštěnka', price: 250, amount: 1, unit: 'ks' },
//   { id: '5', item: 'Barva Igora Royal 7-0', price: 180, amount: 60, unit: 'ml' },
//   { id: '6', item: 'Alufolie na melír', price: 320, amount: 100, unit: 'ks' },
//   { id: '7', item: 'Šampon Silver', price: 290, amount: 300, unit: 'ml' },
//   { id: '8', item: 'Kondicionér bez oplachu', price: 310, amount: 200, unit: 'ml' },
//   { id: '9', item: 'Rukavice nitrilové', price: 120, amount: 100, unit: 'ks' },
//   { id: '10', item: 'Miska na barvu', price: 90, amount: 1, unit: 'ks' },
//   { id: '11', item: 'Štětec na barvení', price: 70, amount: 1, unit: 'ks' },
//   { id: '12', item: 'Oxidant 9%', price: 890, amount: 1000, unit: 'ml' },
//   { id: '13', item: 'Toner Silver Pearl', price: 310, amount: 60, unit: 'ml' },
// ]

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
        <AddEditBuyStockItemButton
          formUsage="purchase"
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
