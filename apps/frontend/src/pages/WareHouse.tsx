import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../components/DataGrid'

const WareHouse = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={rows} columns={columns} />
    </Box>
  )
}

export default WareHouse

type WareHouseItemType = { id: number; item: string; price: number; amount: number; minAmount: number; unit: 'g' }

const rows: WareHouseItemType[] = [
  { id: 1, item: 'Blondor', price: 123000, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 2, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 3, item: 'Alondord', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 4, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 5, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 6, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 7, item: 'Blondor', price: 123000, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 8, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 9, item: 'Alondord', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 10, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 11, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 12, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 13, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 14, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 15, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 16, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
  { id: 17, item: 'Blondor', price: 1230, amount: 1200, minAmount: 400, unit: 'g' },
]

const columns: GridColDef<(typeof rows)[number]>[] = [
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
    minWidth: 60,
    disableColumnMenu: true,
  },
  {
    field: 'minAmount',
    headerName: 'Min.',
    type: 'number',
    disableColumnMenu: true,
  },
  {
    field: 'unit',
    headerName: 'Jdn.',
    type: 'number',
    disableColumnMenu: true,
  },
  {
    field: 'edit',
    headerName: '',
    width: 20,
    editable: false,
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => (
      <BoxIcon
        size={20}
        key={params.id}
        onClick={() => console.log(params.id)}
        icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
        boxColor="secondary.light"
      />
    ),
  },
]
