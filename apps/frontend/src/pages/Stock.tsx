import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../components/DataGrid'
import { useStockItemsQuery } from '../queries'
import ErrorBoundary from './ErrorBoundary'
import { type StockItem } from '../../../entities/stock-item'
import Loader from './Loader'
import { useParams } from 'react-router-dom'
import { formatToCZK } from './VisitDetailGrid'

const Stock = () => {
  const { stockId } = useParams()
  const { data: stockItemData, isError, isLoading } = useStockItemsQuery(stockId)

  if (isLoading) {
    return <Loader />
  }

  if (isError || !stockItemData) {
    return <ErrorBoundary />
  }

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={stockItemData} columns={columns} />
    </Box>
  )
}

export default Stock

const columns: GridColDef<StockItem[][number]>[] = [
  { field: 'itemName', headerName: 'Položka', disableColumnMenu: true, minWidth: 125 },
  {
    field: 'price',
    headerName: 'Cena',
    disableColumnMenu: true,
    minWidth: 90,
    renderCell: (params) => formatToCZK(params.value),
  },
  {
    field: 'quantity',
    headerName: 'Množ.',
    minWidth: 67,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{params.row.unit}</span>
      </>
    ),
  },
  {
    field: 'threshold',
    headerName: 'Min.',
    type: 'number',
    minWidth: 67,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{params.row.unit}</span>
      </>
    ),
  },
  {
    field: 'edit',
    headerName: '',
    width: 20,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <BoxIcon
        size={'small'}
        key={params.id}
        onClick={() => console.log(params.id)}
        icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
        boxColor="secondary.light"
      />
    ),
  },
]
