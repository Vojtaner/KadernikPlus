import { Box, Checkbox } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'

const ShoppingList = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={rows} columns={columns} />
    </Box>
  )
}

export default ShoppingList

type ShoppingListItemType = { id: number; item: string; price: number; amount: number; unit: string }

const rows: ShoppingListItemType[] = [
  { id: 1, item: 'Peroxid 6%', price: 890, amount: 1000, unit: 'ml' },
  { id: 2, item: 'Blondor Multi Blonde', price: 1450, amount: 400, unit: 'g' },
  { id: 3, item: 'Alpecin tonikum', price: 350, amount: 200, unit: 'ml' },
  { id: 4, item: 'Holicí pláštěnka', price: 250, amount: 1, unit: 'ks' },
  { id: 5, item: 'Barva Igora Royal 7-0', price: 180, amount: 60, unit: 'ml' },
  { id: 6, item: 'Alufolie na melír', price: 320, amount: 100, unit: 'ks' },
  { id: 7, item: 'Šampon Silver', price: 290, amount: 300, unit: 'ml' },
  { id: 8, item: 'Kondicionér bez oplachu', price: 310, amount: 200, unit: 'ml' },
  { id: 9, item: 'Rukavice nitrilové', price: 120, amount: 100, unit: 'ks' },
  { id: 10, item: 'Miska na barvu', price: 90, amount: 1, unit: 'ks' },
  { id: 11, item: 'Štětec na barvení', price: 70, amount: 1, unit: 'ks' },
  { id: 12, item: 'Oxidant 9%', price: 890, amount: 1000, unit: 'ml' },
  { id: 13, item: 'Toner Silver Pearl', price: 310, amount: 60, unit: 'ml' },
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
    renderCell: (params) => <Checkbox onClick={() => console.log(params.id)} color="success" />,
  },
]
