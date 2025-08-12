import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import AppDataGrid from '../components/DataGrid'
import { useClientsQuery } from '../queries'
import ErrorBoundary from './ErrorBoundary'
import Loader from './Loader'
import Stack from '@mui/material/Stack'
import type { Client } from '../entities/client'
import { Typography } from '@mui/material'
import AppTheme from '../AppTheme'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { Paths } from '../routes/AppRoutes'
import BoxIcon from '../components/BoxIcon'
import { formatPhoneNumber } from './VisitsList'

const ClientsList = () => {
  const { data: clientList, isLoading, isError } = useClientsQuery()

  if (isLoading) {
    return <Loader />
  }

  if (isError || !clientList) {
    return <ErrorBoundary />
  }

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid
        rowHeight={80}
        rows={clientList}
        columns={createColumns()}
        columnHeaderHeight={50}
        hideFooter={true}
      />
    </Box>
  )
}

export default ClientsList

const createColumns = (): GridColDef<Client[][number]>[] => [
  {
    field: 'name',
    headerName: 'Klient',
    minWidth: 140,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <Typography sx={{ color: '#888', marginLeft: 0 }}>{`${params.row.firstName} ${params.row.lastName}`}</Typography>
    ),
  },
  {
    field: 'phone',
    headerName: 'Telefon',
    minWidth: 90,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        <Typography sx={{ color: '#888', marginLeft: 0 }}>{formatPhoneNumber(params.row.phone)}</Typography>
      </>
    ),
  },
  {
    field: 'edit',
    headerName: '',
    width: 160,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <Stack direction="row" spacing={2}>
        <BoxIcon
          size="medium"
          href={`tel:+420${params.row.phone}`}
          sx={{ background: `${AppTheme.palette.success.light}`, color: `${AppTheme.palette.success.main}` }}
          icon={<PhoneInTalkOutlinedIcon fontSize="small" color="success" />}
        />
        <BoxIcon
          size="medium"
          href={`sms:+420${params.row.phone}`}
          sx={{ background: `${AppTheme.palette.info.light}`, color: `${AppTheme.palette.info.main}` }}
          icon={<SmsOutlinedIcon fontSize="small" color="info" />}
        />
        <BoxIcon
          size="medium"
          href={Paths.clientDetail(params.row.id)}
          sx={{ background: `${AppTheme.palette.primary.light}`, color: `${AppTheme.palette.info.main}` }}
          icon={<PhotoCameraFrontOutlinedIcon fontSize="small" color="primary" />}
        />
      </Stack>
    ),
  },
]
