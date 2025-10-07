import { Stack, Box, Typography, IconButton } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { BasicDatePicker } from '../../../app/components/BasicDatePicker'
import AppDataGrid from '../../../app/components/DataGrid'
import { formatNameShort } from '../../../entity'
import { type VisitListApplyFilter, useAppNavigate, useVisitListFilters } from '../../../hooks'
import { FilterTableButton } from '../../pages/Consumption'
import Loader from '../../pages/Loader'
import { Paths } from '../../../routes/AppRoutes'
import { getMissingStockAllowanceError } from './VisitDetailGrid'
import { DepositStatus, type VisitWithServicesWithProceduresWithStockAllowances } from '../entity'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { useVisitsQuery } from '../queries'
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import { getButtonStyle } from '../../entity'

type VisitListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
  onlyOpenVisits?: boolean
  visitListApplyFilter: VisitListApplyFilter
  enableFilters?: boolean
}

const VisitsList = (props: VisitListProps) => {
  const { columnHeaderHeight, hideFooter = false, visitListApplyFilter, enableFilters = true } = props
  const intl = useIntl()
  const navigate = useAppNavigate()

  const [visitListFilters, updateVisitFilters] = useVisitListFilters(visitListApplyFilter)

  const { control } = useForm({
    defaultValues: {
      from: visitListFilters.dates.from,
      to: visitListFilters.dates.to,
    },
  })

  const onlyOpenVisits = visitListApplyFilter === 'onlyOpenVisits'

  const { data: visitData } = useVisitsQuery({
    query: !onlyOpenVisits
      ? { from: dayjs(visitListFilters.dates.from), to: dayjs(visitListFilters.dates.to) }
      : undefined,
  })

  if (!visitData) {
    return <Loader />
  }

  const onlyOpenVisitsData = visitData.filter((visit) => !visit.visitStatus)

  const onlyClosedVisitsWithoutStockAllowances = visitData.filter(
    (visit) => visit.visitStatus && getMissingStockAllowanceError(visit.procedures)
  )

  const filteredData =
    visitListFilters.view === 'byClosedNoStockAllowances' ? onlyClosedVisitsWithoutStockAllowances : visitData

  const sortedVisits = [...(onlyOpenVisits ? onlyOpenVisitsData : filteredData)].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const rowsWithHeaders = getRowsWithHeaders(sortedVisits)
  const rows = createVisitsTable(rowsWithHeaders)

  return (
    <Stack spacing={4}>
      {enableFilters && (
        <Stack direction="row" spacing={2} justifyContent="flex-start">
          <FilterTableButton
            variant={getButtonStyle(visitListFilters.view, 'byAll')}
            setTableView={() => updateVisitFilters((draft) => (draft.view = 'byAll'))}
            text={intl.formatMessage({
              defaultMessage: 'Všechny',
              id: 'visits.visitViewKey.byAll',
            })}
          />
          <FilterTableButton
            variant={getButtonStyle(visitListFilters.view, 'byClosedNoStockAllowances')}
            setTableView={() => updateVisitFilters((draft) => (draft.view = 'byClosedNoStockAllowances'))}
            text={intl.formatMessage({
              defaultMessage: 'Uzavřené bez spotřeby',
              id: 'visits.visitViewKey.byClosedNoStockAllowances',
            })}
          />
        </Stack>
      )}
      <Stack spacing={2} height="100%">
        {!onlyOpenVisits && (
          <Stack direction="row" spacing={2}>
            <BasicDatePicker
              label="Datum od"
              control={control}
              fieldPath="from"
              onChange={(date) => {
                updateVisitFilters((draft) => {
                  draft.dates.from = date?.toISOString()
                })
              }}
            />
            <BasicDatePicker
              label="Datum od"
              control={control}
              fieldPath="to"
              onChange={(date) => {
                updateVisitFilters((draft) => {
                  draft.dates.to = date?.toISOString()
                })
              }}
            />
          </Stack>
        )}
        {visitListFilters.view === 'byAll' && (
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
        {visitListFilters.view === 'byClosedNoStockAllowances' && (
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
      visitDepositPayed?: never
      clientDeposit?: never
    }
  | {
      id: string
      date: string
      dateTo: string
      client: string
      serviceName: string
      visitState: boolean
      visitDepositPayed: boolean
      clientDeposit: boolean
      clientId: string
      isHeader?: false
      label?: never
    }

export const createColumns = (navigate: (path: string) => void): GridColDef<VisitRow[][number]>[] => [
  {
    field: 'date',
    headerName: 'Čas',
    width: 45,
    hideSortIcons: false,
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
        <Stack>
          <Typography fontSize="12px">{params.row.date}</Typography>
          <Typography color="text.secondary" fontSize="12px">
            {params.row.dateTo}
          </Typography>
        </Stack>
      ),
  },

  {
    field: 'client',
    headerName: 'Zákazník',
    display: 'flex',
    minWidth: 55,
    renderCell: (params) =>
      !params.row.isHeader && (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>
          {params.row.clientDeposit ? (
            !params.row.visitDepositPayed ? (
              <CreditCardOffIcon sx={{ fontSize: '15px' }} color="error" />
            ) : (
              <CreditScoreIcon sx={{ fontSize: '15px' }} color="success" />
            )
          ) : null}
        </Stack>
      ),
  },
  {
    field: 'serviceName',
    headerName: 'Účes',
    minWidth: 70,
    width: 150,
  },
  {
    field: 'visitState',
    headerName: 'Stav',
    width: 70,
    display: 'flex',
    editable: false,
    renderCell: (params) => {
      const isVisitOpen = params.row.visitState
      return (
        !params.row.isHeader && (
          <Typography
            fontSize="0.9rem"
            onClick={() => (params.row.clientId ? navigate(Paths.visitDetail(params.row.clientId, params.row.id)) : {})}
            color={isVisitOpen ? 'success' : 'error'}>
            {isVisitOpen ? 'Uzavř.' : 'Neuzavř.'}
          </Typography>
        )
      )
    },
  },
  {
    field: 'visitDetailButton',
    headerName: 'Detail',
    width: 10,
    editable: false,
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
        visitDepositPayed: undefined,
        clientId: undefined,
      } satisfies VisitRow
    }

    return {
      id: visit.id,
      isHeader: false,
      date: getTimeFromUtcToLocal(visit.date),
      dateTo: getTimeFromUtcToLocal(visit.dateTo),
      client: `${visit.client.firstName} ${visit.client.lastName}`,
      serviceName: visit.visitServices.map((service) => service.service.serviceName).join(','),
      visitState: visit.visitStatus,
      clientId: visit.client.id,
      visitDepositPayed: visit.depositStatus === DepositStatus.ZAPLACENO,
      clientDeposit: visit.client.deposit,
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
