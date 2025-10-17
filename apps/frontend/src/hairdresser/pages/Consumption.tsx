import { Button, Stack, Typography, type ButtonPropsVariantOverrides } from '@mui/material'
import AppDataGrid from '../../app/components/DataGrid'
import type { GridColDef } from '@mui/x-data-grid'
import {
  formatNameShort,
  type ConsumptionTableAllRecordType,
  type ConsumptionTableByProductByUserType,
  type StockViewKey,
} from '../../entity'
import { useForm } from 'react-hook-form'
import Loader from '../Loader'
import ErrorBoundary from './ErrorBoundary'

import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import { Paths } from '../../routes/AppRoutes'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useIntl, type IntlShape } from 'react-intl'
import type { OverridableStringUnion } from '@mui/types'
import { useAppNavigate, usePersistentFilters } from '../../hooks'
import dayjs from 'dayjs'
import { BasicDatePicker } from '../../app/components/BasicDatePicker'
import {
  createStockAllowancesTableAllRecords,
  createStockAllowancesTableByProductByUser,
} from '../stock/components/store'
import { useStockAllowancesQuery } from '../stock/queries'
import { getDateShort } from '../visits/components/VisitsList'
import { getButtonStyle } from '../entity'

const Consumption = () => {
  const navigate = useAppNavigate()
  const intl = useIntl()
  const { teamId } = useParams()
  const [filters, updateFilter] = usePersistentFilters()
  const {
    consumption: { dates, view },
  } = filters

  const [tabelView, setTabelView] = useState<StockViewKey>(view)
  const { control } = useForm({
    defaultValues: {
      from: dayjs(dates.from),
      to: dayjs(dates.to),
    },
  })
  const { data: stockAllowances, isLoading } = useStockAllowancesQuery({
    teamId,
    fromDate: dayjs(dates.from),
    toDate: dayjs(dates.to),
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
    (stockAllowance) => `${stockAllowance.user.name}-${stockAllowance.stockItemName}`
  )
  const stockAllowancesTableByUser = createStockAllowancesTableByProductByUser(
    stockAllowances,
    (stockAllowance) => stockAllowance.user.name
  )

  const handleApplyFilter = (filter: StockViewKey) => {
    setTabelView(filter)
    updateFilter((draft) => {
      draft.consumption.view = filter
    })
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2} justifyContent="flex-start">
        <FilterTableButton
          variant={getButtonStyle(tabelView, 'byProduct')}
          setTableView={() => handleApplyFilter('byProduct')}
          text={intl.formatMessage({ id: 'consumption.stockViewKey.byProducts', defaultMessage: 'Podle produktů' })}
        />
        <FilterTableButton
          variant={getButtonStyle(tabelView, 'byUser')}
          setTableView={() => handleApplyFilter('byUser')}
          text={intl.formatMessage({ defaultMessage: 'Podle lidí', id: 'consumption.stockViewKey.byUser' })}
        />
        <FilterTableButton
          variant={getButtonStyle(tabelView, 'allRecords')}
          setTableView={() => handleApplyFilter('allRecords')}
          text={intl.formatMessage({ defaultMessage: 'Historie záznamů', id: 'consumption.stockViewKey.allRecords' })}
        />
      </Stack>
      <Stack spacing={1} height={'100%'}>
        <Stack direction="row" spacing={2}>
          <BasicDatePicker
            label="Datum od"
            control={control}
            fieldPath="from"
            onChange={(date) => {
              updateFilter((draft) => {
                draft.consumption.dates.from = date?.toISOString()
              })
            }}
          />
          <BasicDatePicker
            label="Datum od"
            control={control}
            fieldPath="to"
            onChange={(date) => {
              updateFilter((draft) => {
                draft.consumption.dates.to = date?.toISOString()
              })
            }}
          />
        </Stack>
        {tabelView === 'allRecords' && (
          <AppDataGrid rows={stockAllowancesTableAllRecords} columns={createColumnsAllRecords(navigate, intl)} />
        )}
        {tabelView === 'byProduct' && (
          <AppDataGrid rows={stockAllowancesTableByProduct} columns={createColumnsByProduct(intl)} />
        )}
        {tabelView === 'byUser' && (
          <AppDataGrid rows={stockAllowancesTableByUser} columns={createColumnsByUser(intl)} />
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

const createColumnsByProduct = (intl: IntlShape): GridColDef<ConsumptionTableByProductByUserType[][number]>[] => [
  { field: 'stockItemName', headerName: 'Položka', flex: 4, disableColumnMenu: true, minWidth: 100 },
  {
    field: 'totalQuantity',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Množ./Kč',
      id: 'consumption.quantityPrice',
    })}`,
    flex: 4,
    minWidth: 70,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{`${params.row.unit}`}</span>
        {' / '}
        {Math.round(params.row.totalPrice)}
        <span style={{ color: '#888', marginLeft: 0 }}>{` Kč`}</span>
      </>
    ),
  },
  {
    field: 'user',
    flex: 4,
    headerName: `${intl.formatMessage({
      defaultMessage: 'Kdo',
      id: 'consumption.person',
    })}`,
    disableColumnMenu: true,
    display: 'flex',
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
]

const createColumnsByUser = (intl: IntlShape): GridColDef<ConsumptionTableByProductByUserType[][number]>[] => [
  {
    field: 'user',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Kdo',
      id: 'consumption.person',
    })}`,
    flex: 6,
    disableColumnMenu: true,
    display: 'flex',
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
  {
    field: 'totalQuantity',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Celkem',
      id: 'consumption.totalQuantity',
    })}`,
    minWidth: 70,
    flex: 6,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {Math.round(params.row.totalPrice)}
        <span style={{ color: '#888', marginLeft: 0 }}>{` Kč`}</span>
      </>
    ),
  },
]

const createColumnsAllRecords = (
  navigate: (path: string) => void,
  intl: IntlShape
): GridColDef<ConsumptionTableAllRecordType[][number]>[] => [
  {
    field: 'date',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Datum',
      id: 'consumption.date',
    })}`,
    flex: 3,
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
  {
    field: 'stockItemName',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Položka',
      id: 'consumption.item',
    })}`,
    flex: 3,
    disableColumnMenu: true,
    minWidth: 100,
  },
  {
    field: 'stockAllowanceQuantity',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Množ./Kč',
      id: 'consumption.quantityPrice',
    })}`,
    flex: 3,
    minWidth: 40,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        {params.value} <span style={{ color: '#888', marginLeft: 0 }}>{`${params.row.unit}`}</span>
        {' / '}
        {Math.round(params.row.totalPrice)}
        <span style={{ color: '#888', marginLeft: 0 }}>{` Kč`}</span>
      </>
    ),
  },
  {
    field: 'user',
    headerName: `${intl.formatMessage({
      defaultMessage: 'Kdo',
      id: 'consumption.person',
    })}`,
    flex: 3,
    disableColumnMenu: true,
    display: 'flex',
    renderCell: (params) => <Typography fontSize="12px">{formatNameShort(params.value)}</Typography>,
  },
]
