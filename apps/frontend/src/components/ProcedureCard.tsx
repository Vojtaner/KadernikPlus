import { Box, Typography, Stack, IconButton } from '@mui/material'
import AppTheme from '../AppTheme'
import AddProcedureButton from './FormDialog/AddProcedureButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { StockAllowance } from '../../../entities/stock-item'

type ProcedureCardProps = {
  description: string
  stockAllowances: StockAllowance[]
  orderNumber: number
  procedureId: string | undefined
}

//spojit proceduru s SMSkou

const ProcedureCard = (props: ProcedureCardProps) => {
  const { description, orderNumber, stockAllowances: defaultStockAllowances, procedureId } = props

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      boxShadow="0px 1px 7px 0px rgba(0,0,0,0.22)"
      borderRadius="10px">
      <Stack sx={{ borderRadius: 0, padding: '1rem' }} spacing={1}>
        <Box
          sx={{
            borderRight: `2px dotted ${AppTheme.palette.primary.light}`,
          }}>
          <Typography variant="h6" sx={{ padding: 1 }} color="primary">
            {`${orderNumber}.`}
          </Typography>
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
          bgcolor: 'secondary.light',
          alignSelf: 'stretch',
          borderRadius: '0 10px 10px 0',
          borderLeft: `1px dotted ${AppTheme.palette.secondary.main}`,
        }}>
        <AddProcedureButton
          defaultValues={{ stockAllowances: defaultStockAllowances, description }}
          procedureId={procedureId}
          openButton={<EditOutlinedIcon />}
        />
      </IconButton>
    </Stack>
  )
}

export default ProcedureCard

type StockAllowanceProps = {
  stockAllowance: StockAllowance
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
