import Box from '@mui/material/Box';
import { type GridColDef } from '@mui/x-data-grid';
import BoxIcon from '../../app/components/BoxIcon';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AppDataGrid from '../../app/components/DataGrid';
import ErrorBoundary from './ErrorBoundary';
import Loader from '../../components/Loader';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Stack from '@mui/material/Stack';
import { StockItemDialog } from '../stock/components/StockItemDialog';
import { mapStocksStockItemsToFlatStockItems, type ExistingStockItem } from '../stock/entity';
import { useStockItemsQuery } from '../stock/queries';
import { formatToCZK } from '../visits/components/VisitDetailGrid';
import DeleteStockItemDialog from '../stock/components/DeleteStockItemDialog';
import { useIntl, type IntlShape } from 'react-intl';

const Stock = () => {
  const { data: stocksWithStockItems, isError, isLoading } = useStockItemsQuery(undefined);
  const stockItems = mapStocksStockItemsToFlatStockItems(stocksWithStockItems);
  const intl = useIntl();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !stockItems) {
    return <ErrorBoundary />;
  }

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid rows={stockItems} columns={createColumns(intl)} />
    </Box>
  );
};

export default Stock;

const createColumns = (intl: IntlShape): GridColDef<ExistingStockItem[][number]>[] => [
  { field: 'itemName', flex: 3, headerName: 'Položka', disableColumnMenu: true, minWidth: 100 },
  {
    field: 'price',
    flex: 2,
    headerName: `${intl.formatMessage({ id: 'stock.price', defaultMessage: 'Cena' })}`,
    disableColumnMenu: true,
    width: 70,
    renderCell: params => {
      return formatToCZK(params.row.totalPrice, 0, 0);
    },
  },
  {
    field: 'packageCount',
    flex: 3,
    headerName: `${intl.formatMessage({ id: 'stock.packageAndThreshold', defaultMessage: 'Bal./Min.' })}`,
    disableColumnMenu: true,
    width: 85,
    renderCell: params => {
      return (
        <>
          <span style={{ color: '#888', marginLeft: 0 }}>{params.row.packageCount} ks</span> /
          <span style={{ color: '#888', marginLeft: 0 }}>{params.row.threshold} ks</span>
        </>
      );
    },
  },
  {
    field: 'quantity',
    headerName: `${intl.formatMessage({ id: 'stock.quantity', defaultMessage: 'Množ.' })}`,
    flex: 2,
    width: 75,
    disableColumnMenu: true,
    renderCell: params => (
      <>
        {params.row.quantity}{' '}
        <span style={{ color: '#888', marginLeft: 0 }}>{params.row.unit}</span>
      </>
    ),
  },
  {
    field: 'edit',
    headerName: '',
    flex: 2,
    width: 100,
    editable: false,
    display: 'flex',
    disableColumnMenu: true,
    renderCell: params => (
      <Stack direction="row" spacing={1}>
        <StockItemDialog
          formUsagePurpose="stockItem"
          defaultValues={{
            id: params.row.id,
            itemName: params.row.itemName,
            stockId: params.row.stockId,
            totalPrice: Math.round(params.row.totalPrice),
            quantity: Math.round(params.row.quantity / params.row.packageCount),
            lastPackageQuantity: params.row.lastPackageQuantity,
            avgUnitPrice: params.row.avgUnitPrice,
            threshold: params.row.threshold,
            unit: params.row.unit,
            packageCount: params.row.packageCount,
          }}
          openButton={
            <BoxIcon
              boxColor="secondary.light"
              size="small"
              icon={<EditOutlinedIcon fontSize="small" color="secondary" />}
            />
          }
        />
        <DeleteStockItemDialog
          stockItemId={params.row.id}
          openButton={
            <BoxIcon
              size="medium"
              icon={<DeleteOutlineIcon fontSize="small" color="secondary" />}
              boxColor="primary.light"
            />
          }
        />
      </Stack>
    ),
  },
];
