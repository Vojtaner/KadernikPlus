import { Stack, Grid, IconButton, Typography, Box, Button } from '@mui/material';
import {
  useWatch,
  Controller,
  type Control,
  type FieldPath,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
} from 'react-hook-form';
import StockItemsAutoComplete from '../../stock/components/StockItemsAutoComplete';
import { useStockItemsQuery } from '../../stock/queries';
import type {
  StockAllowanceFormValues,
  AddProcedureStockAllowanceType,
} from './AddProcedureButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '../../../app/components/TextField';
import { mapStocksStockItemsToFlatStockItems, type StockAllowance } from '../../stock/entity';
import { FormattedMessage, useIntl } from 'react-intl';

type AddStockAllowanceFormProps<TForm extends StockAllowanceFormValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  append: UseFieldArrayAppend<StockAllowanceFormValues, 'stockAllowances'>;
  remove: UseFieldArrayRemove;
  fields: AddProcedureStockAllowanceType;
  readonlyAllowances: (Omit<StockAllowance, 'id' | 'quantity'> & {
    stockAllowanceId: string;
    quantity: number | null;
    stockItemName?: string;
    avgUnitPrice?: string;
  })[];
};

const AddStockAllowanceForm = (props: AddStockAllowanceFormProps<StockAllowanceFormValues>) => {
  const { control, append, remove, fields, readonlyAllowances } = props;
  const intl = useIntl();
  const { data: stocksWithStockItems } = useStockItemsQuery(undefined);
  const stockItems = mapStocksStockItemsToFlatStockItems(stocksWithStockItems);
  const watchedStockAllowanecs = useWatch({ control });

  return (
    <Stack spacing={3}>
      {fields.map((field, index) => {
        const fielArrayStockItem =
          watchedStockAllowanecs.stockAllowances && watchedStockAllowanecs.stockAllowances[index];
        {
          const stockItem =
            fielArrayStockItem &&
            stockItems &&
            stockItems.find(stockItem => stockItem.id === fielArrayStockItem.stockItemId);

          const updatedStockQuantity = stockItem && stockItem.quantity;
          const stockItemQuantityCritical =
            updatedStockQuantity && updatedStockQuantity < stockItem.threshold;

          return (
            <Stack key={field.stockAllowanceId} spacing={0.5}>
              <Grid container spacing={2} alignItems="center">
                <Controller
                  name={`stockAllowances.${index}.stockAllowanceId`}
                  control={control}
                  render={() => <></>}
                />
                <Grid size={7}>
                  <StockItemsAutoComplete
                    fieldPath={`stockAllowances.${index}.stockItemId`}
                    control={control}
                  />
                </Grid>
                <Grid size={3}>
                  <TextField
                    type="number"
                    label={intl.formatMessage(
                      {
                        id: 'formDialogAddProcedure.workflowDescription',
                        defaultMessage: `Množství (unit)`,
                      },
                      { unit: stockItem?.unit ? stockItem?.unit : '' }
                    )}
                    fieldPath={`stockAllowances.${index}.quantity`}
                    control={control}
                    required
                  />
                </Grid>
                <Grid size={2}>
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {stockItem ? (
                <Typography color="text.secondary" fontSize="0.8rem" paddingLeft="0.2rem">
                  <FormattedMessage
                    id="formDialogAddProcedure.stockState"
                    defaultMessage="Aktuálně ve skladu"
                  />
                  <Box
                    component="span"
                    color={stockItemQuantityCritical ? 'primary.main' : 'success.main'}
                    fontWeight="bold"
                  >
                    {` ${updatedStockQuantity} ${stockItem?.unit}`}
                  </Box>
                </Typography>
              ) : null}
            </Stack>
          );
        }
      })}
      {readonlyAllowances.map(stockAllowance => (
        <Stack key={stockAllowance.stockAllowanceId} spacing={0.5}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={7}>
              <TextField
                label={intl.formatMessage({
                  id: 'formDialogAddProcedure.item',
                  defaultMessage: `Položka`,
                })}
                readonly
                defaultValue={stockAllowance.stockItemName}
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label={intl.formatMessage({
                  id: 'formDialogAddProcedure.quantity',
                  defaultMessage: `Množství`,
                })}
                readonly
                defaultValue={stockAllowance.quantity}
              />
            </Grid>
            <Grid size={2}>
              <IconButton onClick={() => {}} color="error" disabled>
                <DeleteOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Typography color="text.secondary" fontSize="0.8rem" paddingLeft="0.2rem">
            <FormattedMessage
              id="formDialogAddProcedure.stockItemWarrning"
              defaultMessage="Položka je ze skladu, ke kterému již nemáte oprávnění nebo je smazána."
            />
          </Typography>
        </Stack>
      ))}
      <Button
        onClick={() => append({ stockItemId: '', quantity: null, stockAllowanceId: '' })}
        variant="outlined"
      >
        <FormattedMessage
          id="formDialogAddProcedure.addStockItem"
          defaultMessage="Přidat materiál"
        />
      </Button>
    </Stack>
  );
};

export default AddStockAllowanceForm;

//service
//stock
//team
//visits
//a níže...
