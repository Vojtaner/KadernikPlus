import { Button, Stack, Typography, type ButtonPropsVariantOverrides } from '@mui/material'
import AppDataGrid from '../components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import { formatNameShort } from '../entity'
import { useStockAllowancesQuery } from '../queries'
import { BasicDatePicker } from '../components/DateTimePicker'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import Loader from './Loader'
import ErrorBoundary from './ErrorBoundary'
import {
  createStockAllowancesTableAllRecords,
  createStockAllowancesTableByProductByUser,
  type ConsumptionTableAllRecordType,
  type ConsumptionTableByProductByUserType,
  type StockViewKey,
} from '../entities/stock-allowance'
import { getDateShort } from './VisitsList'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { Paths } from '../routes/AppRoutes'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { getButtonStyle } from '../components/entity'
import type { OverridableStringUnion } from '@mui/types'
import { useAppNavigate } from '../hooks'

const Consumption = () => {
  const navigate = useAppNavigate()
  const { teamId } = useParams()
  const [tabelView, setTabelView] = useState<StockViewKey>('byUser')
  const intl = useIntl()

  const { control, watch } = useForm({
    defaultValues: {
      from: dayjs().startOf('month'),
      to: dayjs().endOf('month'),
    },
  })

  const { data: stockAllowances, isLoading } = useStockAllowancesQuery({
    teamId,
    fromDate: watch('from'),
    toDate: watch('to'),
  })

  if (!stockAllowances && isLoading) {
    return <Loader />
  }

  if (!stockAllowances) {
    return <ErrorBoundary />
  }

  const stockAllowancesTableAllRecords = createStockAllowancesTableAllRecords(stockAllowances)
  const stockAllowancesTableByProduct = createStockAllowancesTableByProductByUser(
    stockAllowances,
    (stockAllowance) => `${stockAllowance.user.name}-${stockAllowance.stockItem.itemName}`
  )
  const stockAllowancesTableByUser = createStockAllowancesTableByProductByUser(
    stockAllowances,
    (stockAllowance) => stockAllowance.user.name
  )

  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2} justifyContent="flex-start">
        <FilterTableButton
          variant={getButtonStyle(tabelView, 'byProduct')}
          setTableView={() => setTabelView('byProduct')}
          text={intl.formatMessage({ id: 'consumption.stockViewKey.byProducts', defaultMessage: 'Podle produktů' })}
        />
        <FilterTableButton
          variant={getButtonStyle(tabelView, 'byUser')}
          setTableView={() => setTabelView('byUser')}
          text={intl.formatMessage({ defaultMessage: 'Podle lidí', id: 'consumption.stockViewKey.byUser' })}
        />
        <FilterTableButton
          variant={getButtonStyle(tabelView, 'allRecords')}
          setTableView={() => setTabelView('allRecords')}
          text={intl.formatMessage({ defaultMessage: 'Historie záznamů', id: 'consumption.stockViewKey.allRecords' })}
        />
      </Stack>
      <Stack spacing={1} height={'100%'}>
        <Stack direction="row" spacing={2}>
          <BasicDatePicker label="Datum od" control={control} fieldPath="from" />
          <BasicDatePicker label="Datum od" control={control} fieldPath="to" />
        </Stack>
        {tabelView === 'allRecords' && (
          <AppDataGrid rows={stockAllowancesTableAllRecords} columns={createColumnsAllRecords(navigate)} />
        )}
        {tabelView === 'byProduct' && (
          <AppDataGrid rows={stockAllowancesTableByProduct} columns={createColumnsByProductByUser()} />
        )}
        {tabelView === 'byUser' && (
          <AppDataGrid rows={stockAllowancesTableByUser} columns={createColumnsByProductByUser()} />
        )}
      </Stack>
    </Stack>
  )
}

export default Consumption

export const FilterTableButton = (props: {
  setTableView: () => void
  variant: OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides>
  text: string
}) => {
  return (
    <Button onClick={props.setTableView} variant={props.variant} color="primary">
      {props.text}
    </Button>
  )
}

const createColumnsByProductByUser = (): GridColDef<ConsumptionTableByProductByUserType[][number]>[] => [
  { field: 'stockItemName', headerName: 'Položka', disableColumnMenu: true, minWidth: 100 },
  {
    field: 'totalQuantity',
    headerName: 'Množ./Kč',
    minWidth: 70,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{`${params.row.unit}`}</span>
        {' / '}
        {params.row.totalPrice}
        <span style={{ color: '#888', marginLeft: 0 }}>{` Kč`}</span>
      </>
    ),
  },
  {
    field: 'user',
    headerName: 'Kdo',
    disableColumnMenu: true,
    display: 'flex',
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
]
const createColumnsAllRecords = (
  navigate: (path: string) => void
): GridColDef<ConsumptionTableAllRecordType[][number]>[] => [
  {
    field: 'date',
    headerName: 'Datum',
    disableColumnMenu: true,
    minWidth: 40,
    renderCell: (params) => (
      <Button
        sx={{ paddingY: '2px' }}
        endIcon={<PhotoCameraFrontOutlinedIcon />}
        onClick={() => navigate(Paths.visitDetail(params.row.clientId, params.row.visitId))}>
        {getDateShort(params.value)}
      </Button>
    ),
  },
  { field: 'stockItemName', headerName: 'Položka', disableColumnMenu: true, minWidth: 100 },
  {
    field: 'stockAllowanceQuantity',
    headerName: 'Množ./Kč',
    minWidth: 40,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{`${params.row.unit}`}</span>
        {' / '}
        {params.row.totalPrice}
        <span style={{ color: '#888', marginLeft: 0 }}>{` Kč`}</span>
      </>
    ),
  },
  {
    field: 'user',
    headerName: 'Kdo',
    disableColumnMenu: true,
    display: 'flex',
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
]
