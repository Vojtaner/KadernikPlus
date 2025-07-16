import { IconButton, Stack, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import RedSwitch from '../components/RedSwitch'
import { formatNameShort } from '../entity'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { AppRoutes } from '../routes/AppRoutes'
import { useVisitsQuery } from '../queries'
import Loader from './Loader'
import type { GetVisitsType } from '../../../entities/visit'

type VisitListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
}
const VisitsList = (props: VisitListProps) => {
  const { columnHeaderHeight, hideFooter = false } = props
  const { data: visits } = useVisitsQuery()

  if (!visits) {
    return <Loader />
  }

  return (
    <Stack spacing={2}>
      <AppDataGrid
        rows={createVisitsTable(visits)}
        columns={columns}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
      />
    </Stack>
  )
}
export default VisitsList

type VisitListItem = { id: string; date: string; client: string; serviceName: string; visitState: boolean }

export const VisitListRows: VisitListItem[] = [
  { id: '1', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '2', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '3', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '4', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: true },
  { id: '5', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '6', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: true },
  { id: '7', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '8', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '9', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '10', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: true },
  { id: '11', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '12', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
  { id: '13', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
]

const columns: GridColDef<(typeof VisitListRows)[number]>[] = [
  {
    field: 'date',
    headerName: 'Čas',
    disableColumnMenu: true,
    width: 80,
    minWidth: 20,
    display: 'flex',
    renderCell: (params) => <Typography fontSize="12px">{params.value}</Typography>,
  },
  {
    field: 'client',
    headerName: 'Zákazník',
    disableColumnMenu: true,
    display: 'flex',
    minWidth: 80,
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
  {
    field: 'serviceName',
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
      <IconButton href={`${AppRoutes.VisitsList}/${params.id}`}>
        <PhotoCameraFrontOutlinedIcon fontSize="medium" color="primary" />
      </IconButton>
    ),
  },
]

const createVisitsTable = (visits: GetVisitsType[]): VisitListItem[] => {
  return visits.map((visit) => {
    const date = new Date(visit.date)

    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const dateTransformed = `${day}.${month} - ${hours}:${minutes}`

    return {
      id: visit.id,
      date: dateTransformed,
      client: `${visit.client.firstName} ${visit.client.lastName}`,
      serviceName: visit.services.map((service) => service.serviceName).join(','),
      visitState: false,
    }
  })
}
