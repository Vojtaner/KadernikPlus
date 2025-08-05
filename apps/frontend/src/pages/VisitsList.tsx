import { IconButton, Stack, Typography } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import { formatNameShort } from '../entity'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { AppRoutes } from '../routes/AppRoutes'
import { useVisitsQuery } from '../queries'
import Loader from './Loader'
import type { VisitWithServices } from '../entities/visit'
import { BasicDatePicker } from '../components/DateTimePicker'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'

type VisitListProps = {
  columnHeaderHeight?: 0
  hideFooter?: boolean
}

const VisitsList = (props: VisitListProps) => {
  const { columnHeaderHeight, hideFooter = false } = props
  const { control, watch } = useForm({
    defaultValues: {
      from: dayjs().subtract(1, 'day'),
      to: dayjs().add(1, 'day'),
    },
  })

  const fromDate = watch('from')
  const toDate = watch('to')
  const { data: visitData } = useVisitsQuery({ from: fromDate, to: toDate })

  if (!visitData) {
    return <Loader />
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <BasicDatePicker label="Datum od" control={control} fieldPath="from" />
        <BasicDatePicker label="Datum od" control={control} fieldPath="to" />
      </Stack>
      <AppDataGrid
        rows={createVisitsTable(visitData)}
        columns={createColumns()}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
      />
    </Stack>
  )
}
export default VisitsList

type VisitListItem = { id: string; date: string; client: string; serviceName: string; visitState: boolean }

export const createColumns = (): GridColDef<VisitListItem[][number]>[] => [
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
    minWidth: 55,
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
  {
    field: 'serviceName',
    headerName: 'Účes',
    minWidth: 70,
    disableColumnMenu: true,
  },
  {
    field: 'visitState',
    headerName: 'Zavřít',
    width: 90,
    display: 'flex',
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.visitState ? (
        <Typography color="success">Uzavřeno</Typography>
      ) : (
        <Typography color="error">Neuzavřeno</Typography>
      )
    },
  },
  {
    field: 'visitDetailButton',
    headerName: 'Detail',
    width: 10,
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
  return `${day}.${month}. - ${hours}:${minutes}`
}

export const formatPhoneNumber = (digits: string | null): string | undefined => {
  if (!digits) {
    return undefined
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
