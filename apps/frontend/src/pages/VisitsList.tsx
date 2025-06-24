import { IconButton, Stack, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import RedSwitch from '../components/RedSwitch'
import { formatNameShort } from '../entity'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { AppRoutes } from '../routes/AppRoutes'

const VisitsList = () => {
  return (
    <Stack spacing={2}>
      <AppDataGrid rows={rows} columns={columns} />
    </Stack>
  )
}
export default VisitsList

type VisitListItem = { id: number; dateTime: string; customer: string; hairCut: string; visitState: boolean }

const rows: VisitListItem[] = [
  { id: 1, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 2, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 3, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 4, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: true },
  { id: 5, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 6, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: true },
  { id: 7, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 8, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 9, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 10, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: true },
  { id: 11, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 12, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
  { id: 13, dateTime: '12.4.2025 - 13:45', customer: 'Laurionvá Monika', hairCut: 'Baleage', visitState: false },
]

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'dateTime',
    headerName: 'Čas',
    disableColumnMenu: true,
    width: 70,
    minWidth: 20,
    renderCell: (params) => <Typography fontSize="12px">{params.value.split('-')[1]}</Typography>,
  },
  {
    field: 'customer',
    headerName: 'Zákazník',
    disableColumnMenu: true,
    minWidth: 80,
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
  {
    field: 'hairCut',
    headerName: 'Účes',
    minWidth: 80,
    disableColumnMenu: true,
  },
  {
    field: 'visitState',
    headerName: 'Zavřít',
    width: 20,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => <RedSwitch checked={params.value} size="small" />,
  },
  {
    field: 'visitDetailButton',
    headerName: 'Detail',
    width: 20,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <IconButton onClick={() => console.log(params.id)} href={`${AppRoutes.VisitsList}/1`}>
        <PhotoCameraFrontOutlinedIcon fontSize="medium" color="primary" />
      </IconButton>
    ),
  },
]
