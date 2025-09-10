import { Stack } from '@mui/material'
import PricingCard from '../../app/components/PricingCard'
import { useSubscriptionMutation } from '../../queries'

export const SubscriptionPage = () => {
  const { mutation: createPayment } = useSubscriptionMutation()
  return (
    <Stack height="100vh">
      <PricingCard
        title="Cena"
        price="Kč 139"
        period="/měsíc"
        description="Co všechno je v ceně:"
        features={[
          'QR kód na zálohu či recenzi',
          'Automatický nákupní seznam',
          'Chytré vyskladňování skladu',
          'Hlídací pes zásob',
          'Přehled tržeb a nákladů',
        ]}
        ctaText="Zaplatit"
        onClick={() => createPayment.mutate({ currency: 'CZK', plan: 'pro', price: 13900, status: 'PENDING' })}
        active
      />
    </Stack>
  )
}
