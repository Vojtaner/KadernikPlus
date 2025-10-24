import { Box, Typography, Stack, IconButton, Button } from '@mui/material';
import AppTheme from '../AppTheme';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import { useParams } from 'react-router-dom';
import type { PostNewProcedure } from '../entities/procedure';
import AddProcedureButton, {
  type AddProcedureStockAllowanceType,
} from '../hairdresser/procedure/components/AddProcedureButton';
import { useProceduresMutation } from '../hairdresser/procedure/queries';
import { useStocksQuery } from '../hairdresser/stock/queries';
import { getProcedureInvalidation } from '../hairdresser/procedure/entity';
import StockAllowance from '../hairdresser/stock/components/StockAllowance';

//zde pokračovat
type ProcedureCardProps = {
  description: string;
  stockAllowances: AddProcedureStockAllowanceType;
  orderNumber: number;
  procedureId: string | undefined;
  disabled?: boolean;
  isPreviousCopy?: boolean;
};

const ProcedureCard = (props: ProcedureCardProps) => {
  const { visitId } = useParams();
  const { data: stocks } = useStocksQuery();
  const {
    description,
    orderNumber,
    isPreviousCopy,
    disabled,
    stockAllowances: defaultStockAllowances,
    procedureId,
  } = props;

  const { mutation: createNewProcedure } = useProceduresMutation({
    onSuccess: () => {
      getProcedureInvalidation(stocks, visitId);
    },
  });

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      bgcolor={isPreviousCopy ? AppTheme.palette.success.light : ''}
      boxShadow="0px 1px 7px 0px rgba(0,0,0,0.22)"
      borderRadius="10px"
    >
      <Stack sx={{ borderRadius: 0, padding: '1rem' }} spacing={1}>
        <Box
          sx={{
            borderRight: `2px dotted ${AppTheme.palette.primary.light}`,
            textWrap: 'wrap',
          }}
        >
          {isPreviousCopy ? (
            <Typography>Poslední spotřeba</Typography>
          ) : (
            <Typography variant="h6" sx={{ padding: 1 }} color="primary">
              {`${orderNumber}.`}
            </Typography>
          )}
        </Box>
      </Stack>

      <Box
        sx={{
          flexGrow: 1,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          {description}
        </Typography>

        <Stack
          direction="row"
          rowGap={2}
          columnGap={1}
          alignItems="center"
          flexWrap="wrap"
          justifyContent="flex-end"
        >
          {defaultStockAllowances.map(stockAllowance => (
            <StockAllowance
              id={stockAllowance.stockAllowanceId}
              //nechci default na nulu ale typy jsou rozhozený, oprava později
              name={stockAllowance.stockItemName ?? ''}
              quantity={stockAllowance.quantity}
              key={stockAllowance.stockAllowanceId}
            />
          ))}
        </Stack>
      </Box>

      <IconButton
        sx={{
          bgcolor: `${isPreviousCopy ? 'success.light' : 'secondary.light'}`,
          alignSelf: 'stretch',
          borderRadius: '0 10px 10px 0',
          borderLeft: `1px dotted ${AppTheme.palette.secondary.main}`,
        }}
      >
        {isPreviousCopy ? (
          <Button
            variant="contained"
            color="success"
            endIcon={<EventRepeatIcon />}
            onClick={() =>
              createNewProcedure.mutate({
                description,
                visitId,
                id: procedureId,
                stockAllowances: defaultStockAllowances,
              } as unknown as PostNewProcedure)
            }
          >
            Opakovat
          </Button>
        ) : (
          <AddProcedureButton
            defaultValues={{ stockAllowances: defaultStockAllowances, description }}
            procedureId={procedureId}
            openButton={
              <IconButton disabled={disabled}>
                <EditOutlinedIcon />
              </IconButton>
            }
          />
        )}
      </IconButton>
    </Stack>
  );
};

export default ProcedureCard;
