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
import { getButtonStyle } from '../components/entity'
import { useIntl } from 'react-intl'
import { useState } from 'react'
import { FilterTableButton } from './Consumption'
import { getMissingStockAllowanceError } from './VisitDetailGrid'
import { useAppNavigate } from '../hooks'

type VisitListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
  onlyOpenVisits?: boolean
  enableFilters?: boolean
}
type VisitViewKey = 'byClosedNoStockAllowances' | 'byAll'

const VisitsList = (props: VisitListProps) => {
  const { columnHeaderHeight, hideFooter = false, onlyOpenVisits = false, enableFilters = true } = props
  const navigate = useAppNavigate()
  const [tabelView, setTabelView] = useState<VisitViewKey>('byAll')

  const intl = useIntl()

  const { control, watch } = useForm({
    defaultValues: {
      from: dayjs().subtract(1, 'day'),
      to: dayjs().add(1, 'day'),
    },
  })

  const fromDate = watch('from')
  const toDate = watch('to')

  const { data: visitData } = useVisitsQuery({ query: !onlyOpenVisits ? { from: fromDate, to: toDate } : undefined })

  if (!visitData) {
    return <Loader />
  }

  const onlyOpenVisitsData = visitData.filter((visit) => !visit.visitStatus)

  const onlyClosedVisitsWithoutStockAllowances = visitData.filter(
    (visit) => visit.visitStatus && getMissingStockAllowanceError(visit.procedures)
  )

  const filteredData = tabelView === 'byClosedNoStockAllowances' ? onlyClosedVisitsWithoutStockAllowances : visitData
  const sortedVisits = [...(onlyOpenVisits ? onlyOpenVisitsData : filteredData)].sort((a, b) => {
    return getDateTimeFromUtcToLocal(a.date).localeCompare(getDateTimeFromUtcToLocal(b.date))
  })
  const rowsWithHeaders = getRowsWithHeaders(sortedVisits)
  const rows = createVisitsTable(rowsWithHeaders)

  return (
    <Stack spacing={4}>
      {enableFilters && (
        <Stack direction="row" spacing={2} justifyContent="flex-start">
          <FilterTableButton
            variant={getButtonStyle(tabelView, 'byAll')}
            setTableView={() => setTabelView('byAll')}
            text={intl.formatMessage({
              defaultMessage: 'Všechny',
              id: 'visits.visitViewKey.byAll',
            })}
          />
          <FilterTableButton
            variant={getButtonStyle(tabelView, 'byClosedNoStockAllowances')}
            setTableView={() => setTabelView('byClosedNoStockAllowances')}
            text={intl.formatMessage({
              defaultMessage: 'Uzavřené bez spotřeby',
              id: 'visits.visitViewKey.byClosedNoStockAllowances',
            })}
          />
        </Stack>
      )}
      <Stack spacing={2} height={'100%'}>
        {!onlyOpenVisits && (
          <Stack direction="row" spacing={2}>
            <BasicDatePicker label="Datum od" control={control} fieldPath="from" />
            <BasicDatePicker label="Datum od" control={control} fieldPath="to" />
          </Stack>
        )}
        {tabelView === 'byAll' && (
          <AppDataGrid
            rows={rows}
            columns={createColumns(navigate)}
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
        )}
        {tabelView === 'byClosedNoStockAllowances' && (
          <AppDataGrid
            rows={rows}
            columns={createColumns(navigate)}
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
        )}
      </Stack>
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

export const createColumns = (navigate: (path: string) => void): GridColDef<VisitRow[][number]>[] => [
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
          <Typography color={isVisitOpen ? 'success' : 'error'}>{isVisitOpen ? 'Uzavř.' : 'Neuzavř.'}</Typography>
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
      if (!params.row.isHeader && params.row.clientId) {
        const clientId = params.row.clientId
        return (
          <IconButton onClick={() => navigate(Paths.visitDetail(clientId, params.row.id))}>
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
      date: getTimeFromUtcToLocal(visit.date),
      client: `${visit.client.firstName} ${visit.client.lastName}`,
      serviceName: visit.visitServices.map((service) => service.service.serviceName).join(','),
      visitState: visit.visitStatus,
      clientId: visit.client.id,
    } satisfies VisitRow
  })

  return visitsList.filter((visit) => visit !== undefined)
}

export const getTimeFromUtcToLocal = (date: Date) => {
  return dayjs(date).format('HH:mm')
}
export const getDateTimeFromUtcToLocal = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY - HH:mm')
}
export const getDate = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY')
}
export const getDateShort = (date: Date) => {
  return dayjs(date).format('DD.MM.')
}
export const getDateWithDay = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY - dddd')
}

export const formatPhoneNumber = (digits: string | null): string | undefined => {
  if (!digits) {
    return undefined
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

const getRowsWithHeaders = (visits: VisitWithServicesWithProceduresWithStockAllowances[]) => {
  const rows: (VisitWithServicesWithProceduresWithStockAllowances | { isHeader: true; label: string; id: string })[] =
    []

  let lastDate: Date | null = null

  for (const visit of visits) {
    const visitDay = getDate(visit.date)
    const lastDay = lastDate ? getDate(lastDate) : null

    if (visitDay !== lastDay) {
      rows.push({
        id: `header-${visit.date}`,
        isHeader: true,
        label: 'Den - ' + getDateWithDay(visit.date),
      })
      lastDate = visit.date
    }
    rows.push(visit)
  }
  return rows
}
