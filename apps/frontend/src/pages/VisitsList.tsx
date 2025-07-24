import { IconButton, Stack, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import RedSwitch from '../components/RedSwitch'
import { formatNameShort } from '../entity'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { AppRoutes } from '../routes/AppRoutes'
import { useVisitsQuery, useVisitStatusMutation } from '../queries'
import Loader from './Loader'
import type { VisitWithServices } from '../../../entities/visit'
import type { UseMutateFunction } from '@tanstack/react-query'

type VisitListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
}
const VisitsList = (props: VisitListProps) => {
  const { columnHeaderHeight, hideFooter = false } = props
  const { data: visits } = useVisitsQuery()
  const { mutate: changeVisitStatus } = useVisitStatusMutation()

  if (!visits) {
    return <Loader />
  }

  return (
    <Stack spacing={2}>
      <AppDataGrid
        rows={createVisitsTable(visits)}
        columns={createColumns(changeVisitStatus)}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
      />
    </Stack>
  )
}
export default VisitsList

type VisitListItem = { id: string; date: string; client: string; serviceName: string; visitState: boolean }

// export const VisitListRows: VisitListItem[] = [
//   { id: '1', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '2', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '3', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '4', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: true },
//   { id: '5', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '6', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: true },
//   { id: '7', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '8', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '9', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '10', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: true },
//   { id: '11', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '12', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
//   { id: '13', date: '12.4.2025 - 13:45', client: 'Laurionvá Monika', serviceName: 'Baleage', visitState: false },
// ]

// const columns: GridColDef<(typeof VisitListRows)[number]>[] = [
//   {
//     field: 'date',
//     headerName: 'Čas',
//     disableColumnMenu: true,
//     width: 80,
//     minWidth: 20,
//     display: 'flex',
//     renderCell: (params) => <Typography fontSize="12px">{params.value}</Typography>,
//   },
//   {
//     field: 'client',
//     headerName: 'Zákazník',
//     disableColumnMenu: true,
//     display: 'flex',
//     minWidth: 80,
//     renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
//   },
//   {
//     field: 'serviceName',
//     headerName: 'Účes',
//     minWidth: 80,
//     disableColumnMenu: true,
//   },
//   {
//     field: 'visitState',
//     headerName: 'Zavřít',
//     width: 20,
//     editable: false,
//     display: 'flex',
//     disableColumnMenu: true,
//     renderCell: (params) => (
//       <RedSwitch
//         checked={params.value}
//         size="small"
//         onSubmitEndpoint={(checked) => {
//           console.log(checked)
//         }}
//       />
//     ),
//   },
//   {
//     field: 'visitDetailButton',
//     headerName: 'Detail',
//     width: 20,
//     editable: false,
//     display: 'flex',
//     disableColumnMenu: true,
//     renderCell: (params) => (
//       <IconButton href={`${AppRoutes.VisitsList}/${params.id}`}>
//         <PhotoCameraFrontOutlinedIcon fontSize="medium" color="primary" />
//       </IconButton>
//     ),
//   },
// ]

export const createColumns = (
  changeVisitStatus: UseMutateFunction<
    {
      visitId?: string
      status: boolean
    },
    Error,
    | {
        visitId?: string
        status: boolean
      }
    | undefined,
    unknown
  >
): GridColDef<VisitListItem[][number]>[] => [
  {
    field: 'date',
    headerName: 'Čas',
    disableColumnMenu: true,
    width: 80,
    display: 'flex',
    minWidth: 20,
    renderCell: (params) => <Typography fontSize="12px">{params.value}</Typography>,
  },
  {
    field: 'client',
    headerName: 'Zákazník',
    display: 'flex',

    disableColumnMenu: true,
    minWidth: 80,
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
  {
    field: 'serviceName',
    headerName: 'Účes',
    minWidth: 100,
    disableColumnMenu: true,
  },
  {
    field: 'visitState',
    headerName: 'Zavřít',
    width: 20,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <RedSwitch
          checked={params.value}
          size="small"
          onSubmitEndpoint={() => {
            changeVisitStatus({ visitId: params.id.toString(), status: !params.value })
          }}
        />
      )
    },
  },
  {
    field: 'visitDetailButton',
    headerName: 'Detail',
    width: 20,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <IconButton href={`${AppRoutes.VisitsList}/${params.id}`}>
        <PhotoCameraFrontOutlinedIcon fontSize="medium" color="primary" />
      </IconButton>
    ),
  },
]

const createVisitsTable = (visits: VisitWithServices[]): VisitListItem[] => {
  const visitsList = visits.map((visit) => {
    if (!visit.id) {
      return
    }

    return {
      id: visit.id,
      date: getDateTime(visit.date),
      client: `${visit.client.firstName} ${visit.client.lastName}`,
      serviceName: visit.visitServices.map((service) => service.service.serviceName).join(','),
      visitState: visit.visitStatus,
    }
  })
  return visitsList.filter((visitList) => !!visitList)
}

export const getDateTime = (date: Date) => {
  const convertedDate = new Date(date)

  const hours = convertedDate.getUTCHours()
  const minutes = convertedDate.getUTCMinutes().toString().padStart(2, '0')
  const day = convertedDate.getUTCDate()
  const month = convertedDate.getUTCMonth() + 1
  return `${day}.${month} - ${hours}:${minutes}`
}
