import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../components/DataGrid'
import { useDeleteStockItemMutation, useStockItemsQuery } from '../queries'
import ErrorBoundary from './ErrorBoundary'
import { type ExistingStockItem } from '../entities/stock-item'
import Loader from './Loader'
import { useParams } from 'react-router-dom'
import { formatToCZK } from './VisitDetailGrid'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Stack from '@mui/material/Stack'
import { StockItemDialog } from '../components/FormDialogs/AddEditBuyStockItemButton'

const Stock = () => {
  const { stockId } = useParams()
  const { data: stockItemData, isError, isLoading } = useStockItemsQuery(stockId)
  const { mutate: deleteStockItemMutation } = useDeleteStockItemMutation()

  if (isLoading) {
    return <Loader />
  }

  if (isError || !stockItemData) {
    return <ErrorBoundary />
  }

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={stockItemData} columns={createColumns(deleteStockItemMutation)} />
    </Box>
  )
}

export default Stock

const createColumns = (deleteStockItem: (id: string) => void): GridColDef<ExistingStockItem[][number]>[] => [
  { field: 'itemName', headerName: 'Položka', disableColumnMenu: true, minWidth: 100 },
  {
    field: 'price',
    headerName: 'Cena',
    disableColumnMenu: true,
    minWidth: 75,
    renderCell: (params) => {
      return formatToCZK(params.row.totalPrice, 0, 0)
    },
  },
  {
    field: 'packageCount',
    headerName: 'Bal./Min.',
    disableColumnMenu: true,
    width: 85,
    renderCell: (params) => {
      return (
        <>
          <span style={{ color: '#888', marginLeft: 0 }}>{params.row.packageCount} ks</span> {'/'}
          <span style={{ color: '#888', marginLeft: 0 }}>{params.row.threshold} ks</span>
        </>
      )
    },
  },
  {
    field: 'quantity',
    headerName: 'Množ.',
    minWidth: 65,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.row.quantity} <span style={{ color: '#888', marginLeft: 0 }}>{params.row.unit}</span>
      </>
    ),
  },
  {
    field: 'edit',
    headerName: '',
    width: 100,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <StockItemDialog
          formUsagePurpose="stockItem"
          defaultValues={{
            id: params.row.id,
            itemName: params.row.itemName,
            stockId: params.row.stockId,
            totalPrice: Math.round(params.row.totalPrice),
            quantity: Math.round(params.row.quantity / params.row.packageCount),
            lastPackageQuantity: params.row.lastPackageQuantity,
            avgUnitPrice: params.row.avgUnitPrice,
            threshold: params.row.threshold,
            unit: params.row.unit,
            packageCount: params.row.packageCount,
          }}
          openButton={
            <BoxIcon
              boxColor="secondary.light"
              size="small"
              icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
            />
          }
        />
        <BoxIcon
          size="medium"
          onClick={() => params.row.id && deleteStockItem(params.row.id)}
          icon={<DeleteOutlineIcon fontSize="small" color="secondary" />}
          boxColor="primary.light"
        />
      </Stack>
    ),
  },
]
