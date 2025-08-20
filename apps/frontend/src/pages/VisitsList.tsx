import { Box, IconButton, Stack, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import { type GridColDef } from '@mui/x-data-grid'
import { formatNameShort } from '../entity'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { useVisitsQuery } from '../queries'
import Loader from './Loader'
import type { VisitWithServicesWithProceduresWithStockAllowances } from '../entities/visit'
import { BasicDatePicker } from '../components/DateTimePicker'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { Paths } from '../routes/AppRoutes'

type VisitListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
  onlyOpenVisits?: boolean
}

const VisitsList = (props: VisitListProps) => {
  const { columnHeaderHeight, hideFooter = false, onlyOpenVisits = false } = props
  const { control, watch } = useForm({
    defaultValues: {
      from: dayjs().subtract(1, 'day'),
      to: dayjs().add(1, 'day'),
    },
  })

  const fromDate = watch('from')
  const toDate = watch('to')

  const { data: visitData } = useVisitsQuery(!onlyOpenVisits ? { from: fromDate, to: toDate } : undefined)

  if (!visitData) {
    return <Loader />
  }

  const onlyOpenVisitsData = visitData.filter((visit) => !visit.visitStatus)
  const sortedVisits = [...(onlyOpenVisits ? onlyOpenVisitsData : visitData)].sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  // Build rows with group headers
  const getRowsWithHeaders = (visits: VisitWithServicesWithProceduresWithStockAllowances[]) => {
    const rows: (VisitWithServicesWithProceduresWithStockAllowances | { isHeader: true; label: string; id: string })[] =
      []
    let lastDate: string | null = null
    const sortedVisits = [...visits].sort((a, b) => a.date.localeCompare(b.date))

    for (const visit of sortedVisits) {
      const visitDay = new Date(visit.date).toDateString()
      const lastDay = lastDate ? new Date(lastDate).toDateString() : null

      if (visitDay !== lastDay) {
        rows.push({
          id: `header-${visit.date}`,
          isHeader: true,
          label: 'Den - ' + dayjs(visit.date).format('DD.MM.YYYY - dddd'),
        })
        lastDate = visit.date
      }
      rows.push(visit)
    }
    return rows
  }

  const rowsWithHeaders = getRowsWithHeaders(sortedVisits)
  const rows = createVisitsTable(rowsWithHeaders)

  return (
    <Stack spacing={2} height={'100%'}>
      {!onlyOpenVisits && (
        <Stack direction="row" spacing={2}>
          <BasicDatePicker label="Datum od" control={control} fieldPath="from" />
          <BasicDatePicker label="Datum od" control={control} fieldPath="to" />
        </Stack>
      )}
      <AppDataGrid
        rows={rows}
        columns={createColumns()}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
        getRowClassName={(params) => {
          return params.row.isHeader ? 'header-row' : ''
        }}
        getRowHeight={(params) => {
          return params.model.isHeader ? 20 : 40
        }}
        sx={{
          '& .header-row .MuiDataGrid-cell': {
            backgroundColor: '#fff656',
            fontWeight: 'bold',
            textAlign: 'center',
            justifyContent: 'center',
          },
        }}
      />
    </Stack>
  )
}
export default VisitsList

type VisitRow =
  | {
      isHeader: true
      label: string
      id: string
      date?: never
      client?: never
      serviceName?: never
      visitState?: never
      clientId?: never
    }
  | {
      id: string
      date: string
      client: string
      serviceName: string
      visitState: boolean
      clientId: string
      isHeader?: false
      label?: never
    }

export const createColumns = (): GridColDef<VisitRow[][number]>[] => [
  {
    field: 'date',
    headerName: 'Čas',
    disableColumnMenu: true,
    width: 80,
    display: 'flex',
    minWidth: 20,
    renderCell: (params) =>
      params.row.isHeader ? (
        <Box
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            position: 'absolute',
            display: 'flex',
            left: '10px',
          }}>
          {params.row.label}
        </Box>
      ) : (
        <Typography fontSize="12px">{params.value}</Typography>
      ),
  },

  {
    field: 'client',
    headerName: 'Zákazník',
    display: 'flex',
    disableColumnMenu: true,
    minWidth: 55,
    renderCell: (params) =>
      !params.row.isHeader && <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
  {
    field: 'serviceName',
    headerName: 'Účes',
    minWidth: 70,
    disableColumnMenu: true,
  },
  {
    field: 'visitState',
    headerName: 'Stav',
    width: 90,
    display: 'flex',
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const isVisitOpen = params.row.visitState
      return (
        !params.row.isHeader && (
          <Typography color={isVisitOpen ? 'success ' : 'error'}>{isVisitOpen ? 'Uzavř.' : 'Neuzavř.'}</Typography>
        )
      )
    },
  },
  {
    field: 'visitDetailButton',
    headerName: 'Detail',
    width: 10,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      if (!params.row.isHeader) {
        return (
          <IconButton href={Paths.visitDetail(params.row.clientId, params.row.id)}>
            <PhotoCameraFrontOutlinedIcon fontSize="medium" color="primary" />
          </IconButton>
        )
      }
    },
  },
]

const isTypeRowHeader = (
  item: VisitWithServicesWithProceduresWithStockAllowances | { isHeader: true; label: string; id: string }
): item is { isHeader: true; label: string; id: string } => {
  return 'isHeader' in item
}

const createVisitsTable = (
  visits: (VisitWithServicesWithProceduresWithStockAllowances | { isHeader: true; label: string; id: string })[]
): VisitRow[] => {
  const visitsList = visits.map((visit) => {
    if (!visit.id) {
      return
    }

    if (isTypeRowHeader(visit)) {
      return {
        isHeader: true,
        label: visit.label,
        id: visit.id,
        date: undefined,
        client: undefined,
        serviceName: undefined,
        visitState: undefined,
        clientId: undefined,
      } satisfies VisitRow
    }

    return {
      id: visit.id,
      isHeader: false,
      date: dayjs(visit.date).format('HH:mm'),
      client: `${visit.client.firstName} ${visit.client.lastName}`,
      serviceName: visit.visitServices.map((service) => service.service.serviceName).join(','),
      visitState: visit.visitStatus,
      clientId: visit.client.id,
    } satisfies VisitRow
  })

  return visitsList.filter((visit) => visit !== undefined)
}

export const getDateTime = (date: string) => {
  const convertedDate = new Date(date)

  const hours = convertedDate.getUTCHours()
  const minutes = convertedDate.getUTCMinutes().toString().padStart(2, '0')
  const day = convertedDate.getUTCDate()
  const month = convertedDate.getUTCMonth() + 1
  return `${day}.${month}. - ${hours}:${minutes}`
}

export const formatPhoneNumber = (digits: string | null): string | undefined => {
  if (!digits) {
    return undefined
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
