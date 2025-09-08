import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../app/components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../app/components/DataGrid'
import type { Service } from '../entities/service'
import Loader from './Loader'
import ErrorBoundary from './ErrorBoundary'
import AddServiceItemButton from '../domains/service/components/AddServiceItemButton'
import { useServicesQuery } from '../domains/service/queries'

const PriceList = () => {
  const { data: services, isLoading, isError } = useServicesQuery()

  if (isLoading) {
    return <Loader />
  }

  if (isError || !services) {
    return <ErrorBoundary />
  }

  const columns = createColumns()

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={services} columns={columns} />
    </Box>
  )
}

export default PriceList

const createColumns = (): GridColDef<Service[][number]>[] => {
  return [
    { field: 'serviceName', headerName: 'Položka', disableColumnMenu: true, minWidth: 160 },
    {
      field: 'basePrice',
      headerName: 'Cena',
      disableColumnMenu: true,
      width: 120,
      renderCell: (params) => `${params.value},00 Kč`,
    },
    // {
    //   field: 'category',
    //   headerName: 'Kategorie',
    //   type: 'string',
    //   disableColumnMenu: true,
    //   minWidth: 80,
    // },
    {
      field: 'edit',
      headerName: '',
      width: 20,
      editable: false,
      display: 'flex',
      disableColumnMenu: true,
      renderCell: (params) => {
        const { id, basePrice, serviceName } = params.row
        return (
          <AddServiceItemButton
            defaultValues={{
              id,
              basePrice,
              serviceName,
            }}
            openButton={
              <BoxIcon
                size={'small'}
                key={params.id}
                icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
                boxColor="secondary.light"
              />
            }
          />
        )
      },
    },
  ]
}
// id: string
// serviceName: string
// basePrice: number
// userId?: string
// teamId?: string
