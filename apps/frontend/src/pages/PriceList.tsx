import Box from '@mui/material/Box'
import { type GridColDef } from '@mui/x-data-grid'
import BoxIcon from '../components/BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AppDataGrid from '../components/DataGrid'
import { useServicesQuery } from '../queries'
import type { Service } from '../entities/service'
import Loader from './Loader'
import ErrorBoundary from './ErrorBoundary'
import AddServiceItemButton from '../components/FormDialogs/AddServiceItemButton'

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

// const rows: Service[] = [
//   { id: '1', serviceName: 'Stříhání', basePrice: 900 },
//   { id: '2', serviceName: 'Barvení', basePrice: 300 },
//   { id: '3', serviceName: 'Trvalá', basePrice: 800 },
//   { id: '4', serviceName: 'Barva-foukaná', basePrice: 430 },
//   { id: '5', serviceName: 'Barvení', basePrice: 290 },
//   { id: '6', serviceName: 'Barvení', basePrice: 820 },
//   { id: '7', serviceName: 'Trvalá-barva', basePrice: 1100 },
//   { id: '8', serviceName: 'Stříhání-foukání-barva', basePrice: 1900 },
//   { id: '9', serviceName: 'Trvalá-stříhání', basePrice: 2500 },
//   { id: '10', serviceName: 'Barvení', basePrice: 250 },
//   { id: '11', serviceName: 'Trvalá-barevné', basePrice: 490 },
//   { id: '12', serviceName: 'Trvalá-stříhání', basePrice: 300 },
//   { id: '13', serviceName: 'Barber-střih', basePrice: 1230 },
//   { id: '14', serviceName: 'Trvalá-stříhání', basePrice: 920 },
//   { id: '15', serviceName: 'Trvalá', basePrice: 1290 },
//   { id: '16', serviceName: 'Trvalá', basePrice: 490 },
//   { id: '17', serviceName: 'Trvalá', basePrice: 890 },
// ]
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
