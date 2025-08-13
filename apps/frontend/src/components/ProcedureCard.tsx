import { Box, Typography, Stack, IconButton, Button } from '@mui/material'
import AppTheme from '../AppTheme'
import AddProcedureButton, { type AddProcedureStockAllowanceType } from './FormDialog/AddProcedureButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import type { StockAllowance } from '../entities/stock-item'
import { useProceduresMutation, useStocksQuery } from '../queries'
import { queryClient } from '../reactQuery/reactTanstackQuerySetup'
import { useParams } from 'react-router-dom'
import type { PostNewProcedure } from '../entities/procedure'

type ProcedureCardProps = {
  description: string
  stockAllowances: AddProcedureStockAllowanceType
  orderNumber: number
  procedureId: string | undefined
  isDisabled?: boolean
}

//spojit proceduru s SMSkou

const ProcedureCard = (props: ProcedureCardProps) => {
  const { visitId } = useParams()
  const { data: stocks } = useStocksQuery()

  const { description, orderNumber, isDisabled, stockAllowances: defaultStockAllowances, procedureId } = props

  const { mutation: createNewProcedure } = useProceduresMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      queryClient.invalidateQueries({ queryKey: ['procedures', visitId] })
      queryClient.invalidateQueries({ queryKey: ['stockItems', stocks && stocks[0].id] })
    },
  })

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      bgcolor={isDisabled ? AppTheme.palette.success.light : ''}
      boxShadow="0px 1px 7px 0px rgba(0,0,0,0.22)"
      borderRadius="10px">
      <Stack sx={{ borderRadius: 0, padding: '1rem' }} spacing={1}>
        <Box
          sx={{
            borderRight: `2px dotted ${AppTheme.palette.primary.light}`,
            textWrap: 'wrap',
          }}>
          {isDisabled ? (
            <Typography>Poslední spotřeba</Typography>
          ) : (
            <Typography variant="h6" sx={{ padding: 1 }} color="primary">
              {`${orderNumber}.`}
            </Typography>
          )}
        </Box>
      </Stack>

      <Box sx={{ flexGrow: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          {description}
        </Typography>

        <Stack direction="row" rowGap={2} columnGap={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
          {defaultStockAllowances.map((stockAllowance) => (
            <StockAllowance stockAllowance={stockAllowance} key={stockAllowance.id} />
          ))}
        </Stack>
      </Box>

      <IconButton
        sx={{
          bgcolor: `${isDisabled ? 'success.light' : 'secondary.light'}`,
          alignSelf: 'stretch',
          borderRadius: '0 10px 10px 0',
          borderLeft: `1px dotted ${AppTheme.palette.secondary.main}`,
        }}>
        {isDisabled ? (
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
            }>
            Opakovat
          </Button>
        ) : (
          <AddProcedureButton
            defaultValues={{ stockAllowances: defaultStockAllowances, description }}
            procedureId={procedureId}
            openButton={<EditOutlinedIcon />}
          />
        )}
      </IconButton>
    </Stack>
  )
}

export default ProcedureCard

type StockAllowanceProps = {
  stockAllowance: Omit<StockAllowance, 'quantity'> & { quantity: number }
}

const StockAllowance = (props: StockAllowanceProps) => {
  const { stockAllowance } = props

  return (
    <Box boxShadow="0px 1px 7px 0px rgba(0,0,0,0.12)" padding={1} key={stockAllowance.id} borderRadius={2}>
      <Typography fontSize="11px" fontWeight={600} color="secondary">
        {`${stockAllowance.stockItem && stockAllowance.stockItem.itemName} ${stockAllowance.quantity}`}
      </Typography>
    </Box>
  )
}
