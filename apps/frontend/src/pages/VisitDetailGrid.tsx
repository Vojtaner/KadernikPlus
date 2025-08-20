import { Grid, Stack, Typography } from '@mui/material'
import DetailColumn from '../components/DetailColumn'
import Loader from './Loader'
import { getTimeFromUtcToLocal } from './VisitsList'
import { DepositStatus, type VisitWithServices } from '../entities/visit'
import { formatNameShort } from '../entity'

type VisitDetailGridProps = {
  visitData: VisitWithServices | undefined
}
const VisitDetailGrid = (props: VisitDetailGridProps) => {
  const { visitData } = props

  if (!visitData) {
    return <Loader />
  }

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4}>
        <DetailColumn label="Kadeřnice" input={formatNameShort(`${visitData.user.name}`)} />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={`${visitData.visitStatus ? 'Zaplacená' : 'Požadovaná'} cena`}
          input={formatToCZK(visitData.paidPrice)}
          helperText={formatToCZK(visitData.visitServices[0].service.basePrice)}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn label="Datum" input={getTimeFromUtcToLocal(visitData.date)} />
      </Grid>
      {visitData.client.deposit ? (
        <>
          <Grid size={4}>
            <DetailColumn
              label="Stav zálohy"
              input={
                <Typography textTransform="uppercase" fontSize="0.9rem" color="info.main" fontWeight={600}>
                  {visitData.depositStatus}
                </Typography>
              }
            />
          </Grid>
          <Grid size={4}>
            <DetailColumn label="Výše zálohy" input={formatToCZK(visitData.deposit)} />
          </Grid>
        </>
      ) : (
        <Grid size={8} display="flex" alignItems="center">
          <Stack>
            <Typography variant="body1" fontSize="1.2rem" color="secondary.main" fontWeight="800">
              Klient neplatí zálohy.
            </Typography>
            <Typography variant="body2" color={'text.secondary'} fontSize="0.8rem">
              Změníte na klientově profilu
            </Typography>
          </Stack>
        </Grid>
      )}
      <Grid size={4} padding={0}>
        <DetailColumn
          label="Stav návštěvy"
          input={
            <Typography
              fontSize="0.9rem"
              textTransform="uppercase"
              color={visitData.visitStatus ? 'success.main' : 'error.main'}
              fontWeight={600}>
              {visitData.visitStatus ? 'Uzavřeno' : 'Neuzavřeno'}
            </Typography>
          }
        />
      </Grid>
    </Grid>
  )
}

export default VisitDetailGrid

export function formatToCZK(
  value: string | number | undefined,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number
): string {
  if (!value) {
    return '0,00 Kč'
  }
  const numberValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  if (isNaN(numberValue)) {
    return ''
  }

  return numberValue.toLocaleString('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: minimumFractionDigits ?? 2,
    maximumFractionDigits: maximumFractionDigits ?? 2,
  })
}

export const isVisitFinished = (
  clientDeposit: boolean,
  watchFormVisitData: {
    paidPrice: number | undefined
    deposit: number | undefined
    depositStatus: 'NEZAPLACENO' | 'ZAPLACENO' | null | undefined
  }
): boolean => {
  const { paidPrice, deposit, depositStatus } = watchFormVisitData
  const isDepositRequired = clientDeposit

  if (!paidPrice || (!deposit && isDepositRequired)) {
    return false
  }

  const hasPaid = paidPrice > 0
  const hasDeposit = deposit ? deposit > 0 : false

  if (hasPaid && !isDepositRequired) {
    return true
  }

  return hasPaid && isDepositRequired && DepositStatus.ZAPLACENO === depositStatus && hasDeposit
}
