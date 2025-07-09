import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../components/DataGrid'
import { useWareHouseQuery } from '../queries'
import ErrorBoundary from './ErrorBoundary'
import type { WareHouseItemStateType } from '../api/entity'
import Loader from './Loader'

const WareHouse = () => {
  const { data, isError, isLoading } = useWareHouseQuery()

  if (isLoading) {
    return <Loader />
  }

  if (isError || !data) {
    return <ErrorBoundary />
  }
  console.log({ data })

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={data} columns={columns} />
    </Box>
  )
}

export default WareHouse

const columns: GridColDef<WareHouseItemStateType[][number]>[] = [
  { field: 'item', headerName: 'Položka', disableColumnMenu: true, minWidth: 90 },
  {
    field: 'price',
    headerName: 'Cena',
    disableColumnMenu: true,
    minWidth: 80,
  },
  {
    field: 'amount',
    headerName: 'Množ.',
    minWidth: 85,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{params.row.unit}</span>
      </>
    ),
  },
  {
    field: 'minAmount',
    headerName: 'Min.',
    type: 'number',
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
