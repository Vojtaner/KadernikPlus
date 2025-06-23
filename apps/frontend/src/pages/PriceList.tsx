import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../components/DataGrid'

const PriceList = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={rows} columns={columns} />
    </Box>
  )
}

export default PriceList

type PriceItemType = { id: number; item: string; price: number; category: string }

const rows: PriceItemType[] = [
  { id: 1, item: 'Stříhání', category: 'Dámské', price: 900 },
  { id: 2, item: 'Barvení', category: 'Dámské', price: 300 },
  { id: 3, item: 'Trvalá', category: 'Pánské', price: 800 },
  { id: 4, item: 'Barva-foukaná', category: 'Dámské', price: 430 },
  { id: 5, item: 'Barvení', category: 'Dámské', price: 290 },
  { id: 6, item: 'Barvení', category: 'Dámské', price: 820 },
  { id: 7, item: 'Trvalá-barva', category: 'Dětské', price: 1100 },
  { id: 8, item: 'Stříhání-foukání-barva', category: 'Pánské', price: 1900 },
  { id: 9, item: 'Trvalá-stříhání', category: 'Dámské', price: 2500 },
  { id: 10, item: 'Barvení', category: 'Pánské', price: 250 },
  { id: 11, item: 'Trvalá-barevné', category: 'Dámské', price: 490 },
  { id: 12, item: 'Trvalá-stříhání', category: 'Dámské', price: 300 },
  { id: 13, item: 'Barber-střih', category: 'Pánské', price: 1230 },
  { id: 14, item: 'Trvalá-stříhání', category: 'Dámské', price: 920 },
  { id: 15, item: 'Trvalá', category: 'Dámské', price: 1290 },
  { id: 16, item: 'Trvalá', category: 'Dámské', price: 490 },
  { id: 17, item: 'Trvalá', category: 'Dětské', price: 890 },
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
    field: 'category',
    headerName: 'Kategorie',
    type: 'string',
    disableColumnMenu: true,
    minWidth: 80,
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
        size={20}
        key={params.id}
        onClick={() => console.log(params.id)}
        icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
        boxColor="secondary.light"
      />
    ),
  },
]
