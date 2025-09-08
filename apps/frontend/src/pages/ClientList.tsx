import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import AppDataGrid from '../app/components/DataGrid'
import ErrorBoundary from './ErrorBoundary'
import Loader from './Loader'
import Stack from '@mui/material/Stack'
import type { Client } from '../entities/client'
import { Typography } from '@mui/material'
import AppTheme from '../AppTheme'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import { Paths } from '../routes/AppRoutes'
import BoxIcon from '../app/components/BoxIcon'
import { formatPhoneNumber } from '../domains/visits/components/VisitsList'
import SendIcon from '@mui/icons-material/Send'
import { useAppNavigate } from '../hooks'
import SmsSendDialog from '../components/SmsSendDialog'
import { useClientsQuery } from '../domains/client/queries'

const ClientsList = () => {
  const { data: clientList, isLoading, isError } = useClientsQuery()
  const navigate = useAppNavigate()

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
        columns={createColumns(navigate)}
        columnHeaderHeight={50}
        hideFooter={true}
      />
    </Box>
  )
}

export default ClientsList

const createColumns = (navigate: (path: string) => void): GridColDef<Client[][number]>[] => [
  {
    field: 'name',
    headerName: 'Klient',
    flex: 2.5,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <Typography sx={{ color: '#888', marginLeft: 0 }}>{`${params.row.firstName} ${params.row.lastName}`}</Typography>
    ),
  },
  {
    field: 'phone',
    headerName: 'Telefon',
    flex: 2.5,

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
    editable: false,
    flex: 2,

    display: 'flex',
    disableColumnMenu: true,
    renderCell: (params) => (
      <Stack direction="row" spacing={2}>
        <SmsSendDialog
          clientId={params.row.id}
          openButton={
            <BoxIcon
              size="medium"
              sx={{ background: `${AppTheme.palette.info.light}`, color: `${AppTheme.palette.info.main}` }}
              icon={<SendIcon fontSize="small" color="info" />}
            />
          }
        />
        <BoxIcon
          size="medium"
          onClick={() => navigate(Paths.clientDetail(params.row.id))}
          sx={{ background: `${AppTheme.palette.primary.light}`, color: `${AppTheme.palette.info.main}` }}
          icon={<ManageAccountsOutlinedIcon fontSize="small" color="primary" />}
        />
      </Stack>
    ),
  },
]
