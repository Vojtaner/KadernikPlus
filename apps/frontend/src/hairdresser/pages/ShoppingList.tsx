import { Box } from '@mui/material';
import AppDataGrid from '../../app/components/DataGrid';
import { type GridColDef } from '@mui/x-data-grid';
import Loader from '../../components/Loader';
import BoxIcon from '../../app/components/BoxIcon';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { StockItemDialog } from '../stock/components/StockItemDialog';
import { mapStocksStockItemsToFlatStockItems, type StockItem } from '../stock/entity';
import { useStockItemsQuery } from '../stock/queries';
import { formatToCZK } from '../visits/components/VisitDetailGrid';
import { useIntl, type IntlShape } from 'react-intl';

type ShoppingListProps = {
  columnHeaderHeight?: 0;
  hideFooter?: boolean;
};

const ShoppingList = (props: ShoppingListProps) => {
  const { columnHeaderHeight, hideFooter = false } = props;
  const { data: stocksStockItems } = useStockItemsQuery(undefined);
  const stockItems = mapStocksStockItemsToFlatStockItems(stocksStockItems);
  const intl = useIntl();

  if (!stockItems) {
    return <Loader />;
  }

  const shoppingList = createShoppingList(stockItems, intl);
  const shoppingListColumns = createColumns(intl);

  return (
    <Box sx={{ height: '100%' }}>
      <AppDataGrid
        rows={shoppingList}
        columns={shoppingListColumns}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter={hideFooter}
      />
    </Box>
  );
};

export default ShoppingList;

const createShoppingList = (stockItems: StockItem[], intl: IntlShape): ShoppingListItemType[] => {
  return stockItems.flatMap((item): ShoppingListItemType[] => {
    const threshold = Number(item.threshold);
    const avgPrice = Number(item.avgUnitPrice);
    const lastPackageQuantity = Number(item.lastPackageQuantity);
    const packageCount = Number(item.packageCount);

    const requiredPackages = threshold === 0 ? 0 : threshold + 1;

    if (!item.id) {
      throw new Error(
        `${intl.formatMessage({ id: '', defaultMessage: 'Položka item_name nemá ID.' }, { item_name: item.itemName })}`
      );
    }

    if (packageCount < requiredPackages) {
      const missingPackages = Math.round((requiredPackages - packageCount) * 100) / 100;
      const missingUnits = Math.round(missingPackages * lastPackageQuantity * 100) / 100;

      return [
        {
          id: item.id,
          item: item.itemName,
          price: Math.round(missingUnits * avgPrice * 100) / 100,
          amount: missingPackages,
          unit: item.unit,
        },
      ];
    }
    return [];
  });
};

type ShoppingListItemType = {
  id: string;
  item: string;
  price: number;
  amount: number;
  unit: string;
};

const createColumns = (intl: IntlShape): GridColDef<ShoppingListItemType[][number]>[] => {
  return [
    { field: 'item', headerName: 'Položka', flex: 3, disableColumnMenu: true, minWidth: 130 },
    {
      field: 'price',
      headerName: `${intl.formatMessage({ id: 'shoppingList.price', defaultMessage: 'Cena' })}`,
      disableColumnMenu: true,
      flex: 3,
      display: 'flex',
      minWidth: 80,
      renderCell: params => formatToCZK(params.row.price),
    },
    {
      field: 'amount',
      headerName: `${intl.formatMessage({ id: 'shoppingList.quantity', defaultMessage: 'Množství' })}`,
      flex: 3,
      minWidth: 90,
      disableColumnMenu: true,
      renderCell: params => `${params.value} ks`,
    },
    {
      field: 'edit',
      headerName: '',
      flex: 3,
      width: 20,
      editable: false,
      display: 'flex',
      disableColumnMenu: true,
      renderCell: params => (
        <StockItemDialog
          formUsagePurpose="purchase"
          defaultValues={{
            id: params.row.id,
          }}
          openButton={
            <BoxIcon
              size="small"
              boxColor="#61fb0133"
              icon={<EditOutlinedIcon fontSize="small" color="success" />}
            />
          }
        />
      ),
    },
  ];
};
